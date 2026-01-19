import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Review } from "@/types";

// Register fonts
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2",
      fontWeight: 700,
    },
  ],
});

const GOLD = "#F0A202";
const NAVY = "#202C59";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 50,
    fontFamily: "Inter",
    fontSize: 11,
    color: "#333333",
    lineHeight: 1.6,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: `2px solid ${GOLD}`,
  },
  logo: {
    width: 150,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 1,
  },
  logoSubtext: {
    fontSize: 10,
    color: GOLD,
    marginTop: 2,
  },
  headerInfo: {
    textAlign: "right",
  },
  headerLabel: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerValue: {
    fontSize: 10,
    color: "#333",
    marginTop: 2,
    marginBottom: 8,
  },
  // Title Section
  titleSection: {
    marginBottom: 30,
    textAlign: "center",
  },
  documentLabel: {
    fontSize: 10,
    color: GOLD,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 5,
  },
  projectName: {
    fontSize: 24,
    fontWeight: "bold",
    color: NAVY,
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  scoreBadge: {
    backgroundColor: NAVY,
    color: "#ffffff",
    padding: "10 20",
    borderRadius: 5,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  // Content
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: NAVY,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: `1px solid ${GOLD}`,
  },
  paragraph: {
    fontSize: 11,
    color: "#333",
    lineHeight: 1.7,
    textAlign: "justify",
  },
  // Scores Grid
  scoresGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 5,
    marginBottom: 25,
  },
  scoreCard: {
    textAlign: "center",
    padding: 10,
  },
  scoreCardLabel: {
    fontSize: 9,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scoreCardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: NAVY,
    marginTop: 5,
  },
  // Lists
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 10,
  },
  bulletPoint: {
    width: 20,
    fontSize: 10,
  },
  listText: {
    flex: 1,
    fontSize: 11,
    color: "#333",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    borderTop: "1px solid #eee",
  },
  footerText: {
    fontSize: 8,
    color: "#888",
  },
  confidential: {
    fontSize: 8,
    color: "#cc0000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

interface ReportTemplateProps {
  review: Review;
}

export function ReportTemplate({ review }: ReportTemplateProps) {
  const receipt = review.ai_data?.publicReceipt;
  const report = review.ai_data?.privateReport || "";
  const score = review.rating_score || 0;
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Split the report into paragraphs
  const paragraphs = report.split("\n\n").filter((p) => p.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>BODEGA RESEARCH</Text>
            <Text style={styles.logoSubtext}>Web3 Due Diligence</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerLabel}>Report Date</Text>
            <Text style={styles.headerValue}>{date}</Text>
            <Text style={styles.headerLabel}>Document Type</Text>
            <Text style={styles.headerValue}>Private Analyst Report</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.documentLabel}>Due Diligence Report</Text>
          <Text style={styles.projectName}>{review.project_name}</Text>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>
                Overall Score: {score.toFixed(1)}/10
              </Text>
            </View>
          </View>
        </View>

        {/* Scores Grid */}
        {receipt && (
          <View style={styles.scoresGrid}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardLabel}>Product-Market Fit</Text>
              <Text style={styles.scoreCardValue}>{receipt.scores.pmf}</Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardLabel}>UI/UX Quality</Text>
              <Text style={styles.scoreCardValue}>{receipt.scores.ui}</Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardLabel}>Social Sentiment</Text>
              <Text style={styles.scoreCardValue}>
                {receipt.scores.sentiment}
              </Text>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardLabel}>Overall</Text>
              <Text style={styles.scoreCardValue}>{receipt.scores.overall}</Text>
            </View>
          </View>
        )}

        {/* Report Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Analysis</Text>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
              {index < paragraphs.length - 1 ? "\n\n" : ""}
            </Text>
          ))}
        </View>

        {/* Key Findings */}
        {receipt && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Strengths</Text>
              {receipt.theAlpha.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bulletPoint}>+</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Areas of Concern</Text>
              {receipt.theFriction.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bulletPoint}>!</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {receipt.recommendations.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bulletPoint}>{i + 1}.</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            &copy; {new Date().getFullYear()} Bodega Research. All rights reserved.
          </Text>
          <Text style={styles.confidential}>Confidential</Text>
        </View>
      </Page>
    </Document>
  );
}
