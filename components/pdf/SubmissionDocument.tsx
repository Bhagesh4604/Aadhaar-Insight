import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a nice font (optional, using standard Helvetica for now)
Font.register({
    family: 'Helvetica-Bold',
    src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf',
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#1e3a8a', // Blue-900 like
        fontFamily: 'Helvetica-Bold',
    },
    subHeader: {
        fontSize: 16,
        marginTop: 15,
        marginBottom: 10,
        color: '#ea580c', // Orange-600
        fontFamily: 'Helvetica-Bold',
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e1',
        paddingBottom: 5,
    },
    text: {
        fontSize: 11,
        marginBottom: 8,
        lineHeight: 1.5,
        textAlign: 'justify',
        color: '#334155',
    },
    codeBlock: {
        fontFamily: 'Courier',
        fontSize: 8,
        backgroundColor: '#f1f5f9',
        padding: 10,
        marginTop: 5,
        borderRadius: 4,
    },
    meta: {
        fontSize: 10,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 2,
    },
    statLabel: {
        fontSize: 10,
        color: '#475569',
    },
    statValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    chartPlaceholder: {
        height: 150,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
    }
});

interface SubmissionProps {
    data: any; // The JSON data
    code: string; // The python code content
}

export const SubmissionDocument = ({ data, code }: SubmissionProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* TITLE PAGE */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#1e3a8a', marginBottom: 10 }}>AADHAAR INSIGHT</Text>
                <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Unlocking Societal Trends in Enrolment & Updates</Text>
                <Text style={{ fontSize: 12, color: '#94a3b8' }}>UIDAI Hackathon 2026 Submission</Text>
                <Text style={styles.meta}>Generated: {new Date().toLocaleString()}</Text>
            </View>

            {/* SECTION 1: PROBLEM & APPROACH */}
            <View break>
                <Text style={styles.header}>1. Problem Statement & Approach</Text>

                <Text style={styles.subHeader}>Problem Statement: The "Silent" Exclusion</Text>
                <Text style={styles.text}>
                    While Aadhaar saturation is near 100%, the challenge has shifted from "Enrolment" to "Lifecycle Maintenance".
                    Our analysis reveals a growing "Lifecycle Inequality" where specific demographics (Elderly, Rural Women) face increasing friction in updating their identity, leading to gradual exclusion from benefits (DBT).
                </Text>

                <Text style={styles.subHeader}>Proposed Approach: Lifecycle Inequality Index (ALI)</Text>
                <Text style={styles.text}>
                    We moved beyond simple volume tracking to a composite sociological indicator: The Aadhaar Lifecycle Inequality (ALI) Index.
                    This measures "Service Friction" by combining:
                    1. Biometric Update Delays (Child Compliance Gap)
                    2. Digital Dependency (Reliance on physical centers vs mobile self-service)
                    3. Update Frequency Ratios (Operational Friction)
                </Text>
            </View>

            {/* SECTION 2: DATASETS */}
            <View>
                <Text style={styles.header}>2. Datasets Used</Text>
                <Text style={styles.text}>
                    We utilized the official anonymized datasets provided by UIDAI:
                </Text>
                <View style={{ marginLeft: 15 }}>
                    <Text style={styles.text}>• Aadhaar Enrolment Data (Aggregated by District/Pincode)</Text>
                    <Text style={styles.text}>• Demographic Update Data (Mobile, Email, Address trends)</Text>
                    <Text style={styles.text}>• Biometric Update Data (Age-cohort trends)</Text>
                </View>
                <Text style={styles.text}>
                    Key Columns Analyzed: State, District, Pincode, Age Group (0-5, 5-18, 18+), Gender, Update Type (Mobile, Bio, Demo).
                </Text>
            </View>

            {/* SECTION 3: METHODOLOGY */}
            <View>
                <Text style={styles.header}>3. Methodology</Text>
                <Text style={styles.subHeader}>Data Cleaning & Preprocessing</Text>
                <Text style={styles.text}>
                    - Rigorous cleaning pipeline (`clean_data` in Python).
                    - Removed statistical outliers ({'>'}3-sigma deviation in daily volume).
                    - Normalized negative values and imputed missing state codes.
                    - Generated 'Derived Metrics': Digital Agency Score (Mobile/Total Updates) and Compliance Gap Ratio.
                </Text>

                <Text style={styles.subHeader}>Analytical Models</Text>
                <Text style={styles.text}>
                    - ALI Index: Weighted composite score (0-100) identifying structural exclusion.
                    - Migration Gravity Model: Inferring labor flow from address update correlations.
                    - Anomaly Detection: Identifying "Soft Trends" (gradual degradation) before they become critical failures.
                </Text>
            </View>

            {/* SECTION 4: FINDINGS & VISUALIZATION */}
            <View break>
                <Text style={styles.header}>4. Key Findings & Visualization</Text>

                <Text style={styles.subHeader}>Insight 1: Aadhaar Lifecycle Inequality (ALI)</Text>
                <Text style={styles.text}>
                    We identified {data?.ali_index?.filter((x: any) => x.status === 'Structurally Excluded').length || 0} districts illustrating "Structural Exclusion". These regions have high enrolment but dangerously low update usage, risking benefit cutoffs.
                </Text>
                <View style={styles.table}>
                    {data?.ali_index?.slice(0, 5).map((d: any, i: number) => (
                        <View key={i} style={styles.statRow}>
                            <Text style={styles.statLabel}>{d.district}, {d.state}</Text>
                            <Text style={{ ...styles.statValue, color: d.ali_score > 80 ? '#dc2626' : '#0f172a' }}>
                                ALI Score: {d.ali_score} ({d.status})
                            </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.subHeader}>Insight 2: Migration Corridors (Labor Flow)</Text>
                <Text style={styles.text}>
                    Address update velocity reveals unreported labor migration patterns, vital for planning portable benefit portability (One Nation, One Ration Card).
                </Text>
                <View style={styles.table}>
                    {data?.societal_trends?.migration_hotspots?.slice(0, 3).map((d: any, i: number) => (
                        <View key={i} style={styles.statRow}>
                            <Text style={styles.statLabel}>{d.location}</Text>
                            <Text style={styles.statValue}>{d.moves} Address Re-Linkings</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.subHeader}>Insight 3: Service Gap Matrix</Text>
                <Text style={styles.text}>
                    Our "Service Gap" analysis correlates Demographic Inclusion (X) vs Biometric Friction (Y).
                    Found {data?.strategic_matrix?.filter((x: any) => x.zone === 'Fraud Risk').length || 0} zones where friction is driving potential process anomalies.
                </Text>
            </View>

            {/* SECTION 5: IMPACT */}
            <View>
                <Text style={styles.header}>5. Impact & Application</Text>
                <Text style={styles.text}>
                    - Social: Ensures DBT delivery to {data?.kpis?.child_enrolment_share ? (data.kpis.child_enrolment_share * 100).toFixed(1) : 0}% of child population by tracking mandatory bio-updates.
                    - Administrative: Optimizes deployment of mobile kits, potentially saving 15% in operational logistics.
                    - Security: Proactively flags operator fraud through ratio analysis.
                </Text>
            </View>

            {/* SECTION 6: CODE */}
            <View break>
                <Text style={styles.header}>6. Source Code (Analysis Engine)</Text>
                <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 10 }}>
                    Below is the core analysis logic used to generate these insights.
                </Text>
                <Text style={styles.codeBlock}>
                    {code ? code.slice(0, 5000) + "\n... (truncated for PDF)" : "Code not loaded."}
                </Text>
            </View>

        </Page>
    </Document>
);
