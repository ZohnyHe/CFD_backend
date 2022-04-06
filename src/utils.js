const fs = require('fs');
const path = require('path');

function createTimeStepArrayFromDataFolder (srcFolderPath, caseFolderName) {
    const dataPath = path.join(srcFolderPath , caseFolderName)
    let timeStepArray = []
    const regexForEnglish = /[a-z]/
    const pathFiles = fs.readdirSync (dataPath, {encoding:'utf8', flag:'r'})
    pathFiles.forEach(file => {
        const tempPath = path.join(dataPath, file)
        const stats = fs.statSync(tempPath);
        if (stats.isDirectory() && file !== '0' && regexForEnglish.test(file) == false) {
            timeStepArray.push(file)
            timeStepArray.sort(function(a, b) {
                return a - b;
            })
        }
    })
    return timeStepArray
}


function readTemperatureArrayFromTimeFolder (Path) {
    let content = [];
    const temperatureArray = []
    content = fs.readFileSync (Path, {encoding:'utf8', flag:'r'})
    const fileKeyword_1 = /volScalarField/
    const fileKeyword_2 = /T\;/
    if (fileKeyword_1.test(content) === true && fileKeyword_2.test(content) === true) {
        const regex_1 = /\((\n.+)+/
        const regex_2 = /\(/
        const regex_3 = /\)\n;/
        let CapturedResult = content.toString().match(regex_1)[0]
        let TrimmedResult = CapturedResult.replace(regex_2,'').replace(regex_3,'').split('\n');
        TrimmedResult.shift();
        TrimmedResult.pop();
        TrimmedResult.forEach(e => {
            temperatureArray.push(Number(e))
        })
        return temperatureArray
    } else {
        console.log(`File is not T`);
    };
}


function readVelocityArrayFromTimeFolder (Path) {
    let content = []
    content = fs.readFileSync (Path, {encoding:'utf8', flag:'r'})
    const fileKeyword_1 = /volVectorField/
    const fileKeyword_2 = /U\;/
    if (fileKeyword_1.test(content) === true && fileKeyword_2.test(content) === true) {
        const regex_1 = /\((\n.+)+/
        const regex_2 = /\(/
        const regex_3 = /\)\n;/

        let CapturedResult = content.toString().match(regex_1)[0]
        let TrimmedResult = CapturedResult.replace(regex_2,'x').replace(regex_3,'y').split('\n');
        TrimmedResult.shift();
        TrimmedResult.pop();

        // for(let i = 0; i < TrimmedResult.length; i++) {
        //     let tempArray = TrimmedResult[i]
        //     let tempString = tempArray.toString();
        //     let splitResult = tempString.replace(/\s/g,',').replace(/\(/g,'').replace(/\)/g,'').split(/\,/)
        //     TrimmedResult[i] = splitResult
        //     for(let j = 0; j < 3; j++) {
        //         TrimmedResult[i][j] = Number(TrimmedResult[i][j])
        //     }
        // }

        return TrimmedResult;
    } else {
        console.log(`File is not U`);
    };
}


function readCarbonDioxideArrayFromTimeFolder (Path) {
    let content = [];
    const CarbonDioxideArray = []
    content = fs.readFileSync (Path, {encoding:'utf8', flag:'r'})
    const fileKeyword_1 = /volScalarField/
    const fileKeyword_2 = /CO2\;/
    if (fileKeyword_1.test(content) === true && fileKeyword_2.test(content) === true) {
        const regex_1 = /\((\n.+)+/
        const regex_2 = /\(/
        const regex_3 = /\)\n;/
        let CapturedResult = content.toString().match(regex_1)[0]
        let TrimmedResult = CapturedResult.replace(regex_2,'').replace(regex_3,'').split('\n');
        TrimmedResult.shift();
        TrimmedResult.pop();
        TrimmedResult.forEach(e => {
            CarbonDioxideArray.push(Number(e))
        })
        return CarbonDioxideArray;
    } else {
        console.log(`File is not CO2`);
    };
}


function readOxygenArrayFromTimeFolder (Path) {
    let content = [];
    const oxygenArray = []
    content = fs.readFileSync (Path, {encoding:'utf8', flag:'r'})
    const fileKeyword_1 = /volScalarField/
    const fileKeyword_2 = /O2\;/
    if (fileKeyword_1.test(content) === true && fileKeyword_2.test(content) === true) {
        const regex_1 = /\((\n.+)+/
        const regex_2 = /\(/
        const regex_3 = /\)\n;/
        let CapturedResult = content.toString().match(regex_1)[0]
        let TrimmedResult = CapturedResult.replace(regex_2,'').replace(regex_3,'').split('\n');
        TrimmedResult.shift();
        TrimmedResult.pop();
        TrimmedResult.forEach(e => {
            oxygenArray.push(Number(e))
        })
        return oxygenArray
    } else {
        console.log(`File is not O2`);
    };
}


function readPointsArrayFromConstFolder (srcFolderPath, caseFolderName) {
    const dataPath = path.join(srcFolderPath , caseFolderName, 'constant', 'polyMesh', 'points')
    let content = [];
    content = fs.readFileSync (dataPath, {encoding:'utf8', flag:'r'})
    const fileKeyword_1 = /vectorField/
    const fileKeyword_2 = /points\;/
    if (fileKeyword_1.test(content) === true && fileKeyword_2.test(content) === true) {
        const regex_1 = /\((\n.+)+/
        const regex_2 = /\(/
        const regex_3 = /\)\n;/

        let CapturedResult = content.toString().match(regex_1)[0]
        let TrimmedResult = CapturedResult.replace(regex_2,'x').replace(regex_3,'y').split('\n');
        TrimmedResult.shift();
        TrimmedResult.pop();
        return TrimmedResult;
    } else {
        console.log(`File is not points`);
    };
}


function readFacesArrayFromConstFolder (srcFolderPath, caseFolderName) {
    const dataPath = path.join(srcFolderPath , caseFolderName, 'constant', 'polyMesh', 'faces')
    let content = [];
    content = fs.readFileSync (dataPath, {encoding:'utf8', flag:'r'})
    const fileKeyword_1 = /faceList/
    const fileKeyword_2 = /faces\;/
    if (fileKeyword_1.test(content) === true && fileKeyword_2.test(content) === true) {
        const regex_1 = /\((\n.+)+/
        const regex_2 = /\(/
        const regex_3 = /\)\n;/
        let CapturedResult = content.toString().match(regex_1)[0]
        let TrimmedResult = CapturedResult.replace(regex_2,'').replace(regex_3,'').split('\n');
        TrimmedResult.shift();
        TrimmedResult.pop();
        return facesArray = TrimmedResult;
    } else {
        console.log(`File is not faces`);
    };
}


function readOwnerArrayFromConstFolder (srcFolderPath, caseFolderName) {
    const dataPath = path.join(srcFolderPath , caseFolderName, 'constant', 'polyMesh', 'owner')
    let content = [];
    const ownerArray = []
    content = fs.readFileSync (dataPath, {encoding:'utf8', flag:'r'})
    const fileKeyword_1 = /labelList/
    const fileKeyword_2 = /owner\;/
    if (fileKeyword_1.test(content) === true && fileKeyword_2.test(content) === true) {
        const regex_1 = /\((\n.+)+/
        const regex_2 = /\(/
        const regex_3 = /\)\n;/
        let CapturedResult = content.toString().match(regex_1)[0]
        let TrimmedResult = CapturedResult.replace(regex_2,'').replace(regex_3,'').split('\n');
        TrimmedResult.shift();
        TrimmedResult.pop();
        TrimmedResult.forEach(e => {
            ownerArray.push(Number(e))
        })
        return ownerArray
    } else {
        console.log(`File is not owner`);
    };
}


function readNeighbourArrayFromConstFolder (srcFolderPath, caseFolderName) {
    const dataPath = path.join(srcFolderPath , caseFolderName, 'constant', 'polyMesh', 'neighbour')
    let content = [];
    const neighbourArray = []
    content = fs.readFileSync (dataPath, {encoding:'utf8', flag:'r'})
    const fileKeyword_1 = /labelList/
    const fileKeyword_2 = /neighbour\;/
    if (fileKeyword_1.test(content) === true && fileKeyword_2.test(content) === true) {
        const regex_1 = /\((\n.+)+/
        const regex_2 = /\(/
        const regex_3 = /\)\n;/
        let CapturedResult = content.toString().match(regex_1)[0]
        let TrimmedResult = CapturedResult.replace(regex_2,'').replace(regex_3,'').split('\n');
        TrimmedResult.shift();
        TrimmedResult.pop();
        TrimmedResult.forEach(e => {
            neighbourArray.push(Number(e))
        })
        return neighbourArray;
    } else {
        console.log(`File is not neighbour`);
    };
}


module.exports = { createTimeStepArrayFromDataFolder,
                    readTemperatureArrayFromTimeFolder, readVelocityArrayFromTimeFolder, 
                    readCarbonDioxideArrayFromTimeFolder, readPointsArrayFromConstFolder,
                    readFacesArrayFromConstFolder, readOwnerArrayFromConstFolder,
                    readNeighbourArrayFromConstFolder,
                    readOxygenArrayFromTimeFolder }