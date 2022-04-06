const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { createTimeStepArrayFromDataFolder, readTemperatureArrayFromTimeFolder,
        readVelocityArrayFromTimeFolder, readPointsArrayFromConstFolder,
        readFacesArrayFromConstFolder, readOxygenArrayFromTimeFolder,
        readOwnerArrayFromConstFolder, readNeighbourArrayFromConstFolder,
        readCarbonDioxideArrayFromTimeFolder } = require('../utils')

const srcFolderPath = './CFD_outputData/'
const { 
    CaseData, OutputData, ConstData
            } = require('../../models');


router.post('/data', express.json(), async(req, res) => {
    const { userName, caseFolderName, caseName } = req.body
    try { 
        const caseData = await CaseData.create({
            userName: userName, caseName: caseName })
        const pointsArray = readPointsArrayFromConstFolder(srcFolderPath, caseFolderName)
        const tempPointString = pointsArray.toString();
        const points = tempPointString.replace(/\(/g,'').replace(/\)/g,'').split(/\,/)
        const facesArray = readFacesArrayFromConstFolder(srcFolderPath, caseFolderName)
        const tempFaceString = facesArray.toString();
        const faces = tempFaceString.replace(/.\(/g,'').replace(/\)/g,'').split(/\,/)
        const owner = readOwnerArrayFromConstFolder(srcFolderPath, caseFolderName)
        const neighbour = readNeighbourArrayFromConstFolder(srcFolderPath, caseFolderName)
        
        const TimeStepArray = createTimeStepArrayFromDataFolder(srcFolderPath, caseFolderName)
        const constData = await ConstData.create({
            caseId: caseData.caseId, points: points, faces: faces, owners: owner, neighbours: neighbour 
        })

        for(let timeIndex = 0; timeIndex < TimeStepArray.length; timeIndex++) {    
            const tempTemperaturePath = path.join(srcFolderPath, caseFolderName, TimeStepArray[timeIndex].toString(), 'T')
            let temperature = []
                try {
                    const stats = fs.statSync(tempTemperaturePath)
                    temperature = readTemperatureArrayFromTimeFolder(tempTemperaturePath)
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        console.error(`Not such T ${timeIndex}`)
                } else {
                    console.log(`unknown error`);
                }
            }

            const tempVelocityPath = path.join(srcFolderPath, caseFolderName, TimeStepArray[timeIndex].toString(), 'U')
            let velocity = []
                try {
                    const stats = fs.statSync(tempTemperaturePath)
                    // velocity = readVelocityArrayFromTimeFolder(tempVelocityPath)
                    const velocityArray = readVelocityArrayFromTimeFolder(tempVelocityPath)
                    const tempString = velocityArray.toString();
                    velocity =  tempString.replace(/\(/g,'').replace(/\)/g,'').split(/\,/)
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        console.error(`Not such U ${timeIndex}`)
                } else {
                    console.log(`unknown error`);
                }
            }

            const tempCarbonDioxidePath = path.join(srcFolderPath, caseFolderName, TimeStepArray[timeIndex].toString(), 'CO2')
            let carbonDioxide = []
                try {
                    const stats = fs.statSync(tempCarbonDioxidePath)
                    carbonDioxide = readCarbonDioxideArrayFromTimeFolder(tempCarbonDioxidePath)
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        console.error(`Not such CO2 ${timeIndex}`)
                } else {
                    console.log(`unknown error`);
                }
            }

            const tempOxygenPath = path.join(srcFolderPath, caseFolderName, TimeStepArray[timeIndex].toString(), 'O2')
            let oxygen = []
                try {
                    const stats = fs.statSync(tempOxygenPath)
                    oxygen = readOxygenArrayFromTimeFolder(tempCarbonDioxidePath)
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        console.error(`Not such O2 ${timeIndex}`)
                } else {
                    console.log(`unknown error`);
                }
            }
            const outputData = await OutputData.create({
                caseId: caseData.caseId, timeStep: TimeStepArray[timeIndex], 
                temperature: temperature, velocity: velocity, carbonDioxide: carbonDioxide, oxygen: oxygen
            }) 
        }
        return res.json({ message: `Insert complete!` })
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

router.get('/userInfo/:userName', express.json(), async(req, res) => {
    try {
        const caseData = await CaseData.findAll({
            where: { userName: req.params.userName } })
        if(!isNaN(caseData)) {
            return res.json({ message: `Can't find user: ${req.params.userName}`})
        } else {
            const casesNumber = caseData.length
            const returnData = {}
            for(let casesIndex = 0; casesIndex < casesNumber; casesIndex++){
                returnData[casesIndex] = caseData[casesIndex]
            }
            return res.json(returnData)
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
        }
})


router.get('/timeSteps/:userName/:caseName', async(req, res) => {
    try {
        const caseData = await CaseData.findOne({
            where: { userName: req.params.userName, caseName: req.params.caseName } })
        if(!isNaN(caseData)) {
            return res.json({ message: `Can't find data: ${req.params.userName}`})
        } else {
            const outputData = await OutputData.findAll({
                where: { caseId: caseData.caseId },
                attributes: ['timeStep']
            })
            const timeStepLength = outputData.length
            const timeStep = []
            for(let timeIndex = 0; timeIndex < timeStepLength; timeIndex++){
                timeStep.push(Number(outputData[timeIndex].timeStep))
            }
            return res.json(timeStep)
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Something went wrong`})
    }
})


router.get('/attributes/:userName/:caseName', async(req, res) => {
    try {
        const caseData = await CaseData.findOne({
            where: { userName: req.params.userName, caseName: req.params.caseName } })
        if(!isNaN(caseData)) {
            return res.json({ message: `Can't find data: ${req.params.userName}`})
        } else {
                const outputData = await OutputData.findOne({
                    where: { caseId: caseData.caseId }
                })
                const idRegex = /Id/
                const AtRegex = /At/
                const rawAttributes = await OutputData.rawAttributes
                const Attributes = []
                for(let key in rawAttributes) {
                    if(isNaN(outputData[key]) && !idRegex.test(key) && !AtRegex.test(key)) {
                        Attributes.push(key)
                    }
                }
            return res.json(Attributes)
            }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Something went wrong`})
    }
})


router.get('/constData/:userName/:caseName', async(req, res) => {
    try {
        const caseName = await CaseData.findOne({
            where: { userName: req.params.userName, caseName: req.params.caseName } })
        if(!isNaN(caseName)) {
            return res.json({ message: `Can't find data: ${req.params.userName}`})
        } else {
            const constData = await ConstData.findOne({
                where: { caseId: caseName.caseId },
                attributes: ['points', 'faces', 'owners', 'neighbours']
            })
            return res.json(constData)
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Something went wrong`})
    }
})


router.get('/outputData/', express.json(), async(req, res) => {   
    try {
        const caseData = await CaseData.findOne({
            where: { userName: req.query.userName, caseName: req.query.caseName } })
        if(!isNaN(caseData)) {
            return res.json({ message: `Can't find data: ${req.params.userName}`})
        } else {
                const Attributes = []
                const idRegex = /Id/
                const AtRegex = /At/
                const attributes = await OutputData.rawAttributes
                for(let key in attributes) {
                    if(idRegex.test(key) == false && AtRegex.test(key) == false) {
                        Attributes.push(key)
                    }
                }
                const AttributesBoolean = []
                const timeIndex = req.query.timeIndex
                AttributesBoolean[1] = req.query.temperature
                AttributesBoolean[2] = req.query.velocity
                AttributesBoolean[3] = req.query.carbonDioxide
                AttributesBoolean[4] = req.query.oxygen
                const showingAttributes = []
                showingAttributes[0] = 'timeStep'

                for(let index = 1; index < AttributesBoolean.length; index++){
                    if(AttributesBoolean[index] == 'true') {
                        showingAttributes.push(Attributes[index])
                    }
                }

                if (isNaN(timeIndex) && isNaN(req.query.timeStart) && isNaN(req.query.timeEnd)) {
                    const outputData = await OutputData.findAll({
                        where: { caseId: caseData.caseId },
                        attributes: showingAttributes,
                    })
                return res.json(outputData)
                } else if (isNaN(timeIndex) && !isNaN(req.query.timeStart) && !isNaN(req.query.timeEnd)) {
                    let firstTimeIndex = req.query.timeStart
                    let lastTimeIndex = req.query.timeEnd
                    if (lastTimeIndex-firstTimeIndex <= 0) {
                        return res.json(`Time range error!`)
                    } else {
                        const outputData = await OutputData.findAll({
                            where: { caseId: caseData.caseId },
                            attributes: showingAttributes,
                        })
                        const returnData = {}
                        for(let timeIndex = firstTimeIndex; timeIndex <= lastTimeIndex; timeIndex++){
                            returnData[timeIndex] = outputData[timeIndex]
                        }
                        return res.json(returnData)
                    }
                } else {
                    const outputData = await OutputData.findAll({
                        where: { caseId: caseData.caseId },
                        attributes: showingAttributes,
                    })                   
                return res.json(outputData[timeIndex])
                }
            }      
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})


module.exports = router;