import shelljs from "shelljs";
import { fstat, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

function getAllFiles(dir) {
  return readdirSync(dir).reduce((files, file) => {
    const name = join(dir, file);
    const isDirectory = statSync(name).isDirectory();
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
  }, []);
}

function groupBy(arr, n) {
    var group = [];
    for (var i = 0, end = arr.length / n; i < end; ++i)
        group.push(arr.slice(i * n, (i + 1) * n));
    return group;
}

function removeComments(text) {
    let lines = text.split("\n");

    // Remove in-line comments
    lines = lines.map((l) => {
        const index = l.indexOf('//');

        if(index === -1) {
            return l;
        }

        return l.substring(0, index);
    });

    // Remove empty line
    lines = lines.filter((l) => l.split(" ").join("").length > 0);

    // Remove last space in line
    lines = lines.map((l) => l.trimEnd());

    return lines.join("\n");
}

function removeSpaces(text) {
    let letters = text.split("");

    let newText = "";
    let isComment = false;

    let i = 0;
    for(const letter of letters) {
        if(!isComment) {
            if(letter === '/' && letters[i+1] === '*') {
                isComment = true;
                i++;
                continue;
            }
        }

        if(isComment) {
            if(letter === '/' && letters[i-1] === '*') {
                isComment = false;
                i++;
                continue;
            }
        }

        if(!isComment) {
            newText += letter;
        }

        i++;
    }

    return newText;
}

const repos = JSON.parse(readFileSync('utopia-repos.json').toString());

const snippets = [];

let date = new Date('2022-01-01T00:00:00+0000');

for(const repo of repos) {
    const cmd = `git clone https://github.com/${repo.full_name}.git repositories/${repo.name}`;

    shelljs.exec(cmd);

    const files = getAllFiles(`repositories/${repo.name}`)
        .filter((f) => f.endsWith('.php'))
        .filter((f) => f.includes('/src/'));

    for(const file of files) {
        const text = removeComments(removeSpaces(readFileSync(file).toString()));

        const lines = text.split('\n');
        const groups = groupBy(lines, 15);

        let i = 0;
        for(const group of groups) {
            const groupBefore = groups[i-1] ?? [];
            const textBefore = groupBefore.slice(-3);

            const groupAfter = groups[i+1] ?? [];
            const textAfter = groupAfter.slice(-3);

            snippets.push({
                date: date.toISOString(),
                text: group.join("\n"),
                textBefore: textBefore.join("\n"),
                textAfter: textAfter.join("\n"),
            });

            date = new Date(date.getTime() + (1000*86400));
            i++;
        }
    }

    shelljs.rm('-rf', `repositories/${repo.name}`);
}

writeFileSync('seeds.json', JSON.stringify(snippets, undefined, 2));