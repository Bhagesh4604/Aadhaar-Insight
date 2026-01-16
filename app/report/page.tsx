import React from 'react';
import fs from 'fs';
import path from 'path';
import ReportClient from './ReportClient';

export default async function ReportPage() {
    // 1. Read the Code File
    const codePath = path.join(process.cwd(), '..', 'data_engine', 'analysis_core.py');
    let codeContent = '';
    try {
        codeContent = fs.readFileSync(codePath, 'utf-8');
    } catch (err) {
        console.error("Could not read code file:", err);
        codeContent = "# Code file could not be loaded automatically.\n# Please verify path: " + codePath;
    }

    // 2. Read the Data File
    const dataPath = path.join(process.cwd(), 'public', 'data.json');
    let dataContent = {};
    try {
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        dataContent = JSON.parse(rawData);
    } catch (err) {
        console.error("Could not read data file:", err);
        dataContent = { error: "Data not found. Please run python analysis_core.py first." };
    }

    return (
        <ReportClient data={dataContent} code={codeContent} />
    );
}
