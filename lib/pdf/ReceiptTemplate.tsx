import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Review } from "@/types";

// Register a monospace font (Space Mono would be ideal, using Courier as fallback)
Font.register({
  family: "Courier",
  src: "https://fonts.gstatic.com/s/courierprime/v9/u-450q2lgwslOqpF_6gQ8kELWwZj.woff2",
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f5f5dc",
    padding: 20,
    fontFamily: "Courier",
    fontSize: 10,
    color: "#1a1a1a",
    width: 300, // Thermal receipt width
  },
  header: {
    textAlign: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 8,
    color: "#666",
    marginTop: 5,
  },
  date: {
    fontSize: 8,
    color: "#888",
    marginTop: 5,
  },
  divider: {
    borderTop: "2px dashed #ccc",
    marginVertical: 10,
  },
  projectName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  scoreBox: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: 15,
    textAlign: "center",
    marginVertical: 15,
    borderRadius: 5,
  },
  scoreLabel: {
    fontSize: 8,
    color: "#888",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  section: {
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 5,
  },
  bullet: {
    width: 15,
    color: "#666",
  },
  listText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
  },
  scoresGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  scoreItem: {
    textAlign: "center",
    flex: 1,
  },
  scoreItemLabel: {
    fontSize: 8,
    color: "#666",
    marginBottom: 3,
  },
  scoreItemValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 8,
    color: "#888",
    marginBottom: 3,
  },
  stars: {
    fontSize: 8,
    color: "#ccc",
    letterSpacing: 0,
  },
  verifiedStamp: {
    marginTop: 15,
    padding: 10,
    border: "3px solid #228B22",
    borderRadius: 5,
    textAlign: "center",
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#228B22",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  tearEdge: {
    marginTop: 10,
    height: 15,
    // Simulated tear edge using a pattern
  },
});

interface ReceiptTemplateProps {
  review: Review;
}

export function ReceiptTemplate({ review }: ReceiptTemplateProps) {
  const receipt = review.ai_data?.publicReceipt;
  const score = review.rating_score || 0;
  const isVerified = score >= 8;
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size={{ width: 300, height: 800 }} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BODEGA RESEARCH</Text>
          <Text style={styles.subtitle}>*** WEB3 DUE DILIGENCE ***</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.divider} />

        {/* Project Name */}
        <Text style={styles.projectName}>{review.project_name}</Text>

        {/* Overall Score */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>OVERALL SCORE</Text>
          <Text style={styles.scoreValue}>{score.toFixed(1)}/10</Text>
        </View>

        <View style={styles.divider} />

        {/* Scores Breakdown */}
        {receipt && (
          <>
            <Text style={styles.sectionHeader}>ITEM BREAKDOWN</Text>
            <View style={styles.scoresGrid}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>PMF</Text>
                <Text style={styles.scoreItemValue}>
                  {receipt.scores.pmf}/10
                </Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>UI/UX</Text>
                <Text style={styles.scoreItemValue}>
                  {receipt.scores.ui}/10
                </Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>VIBE</Text>
                <Text style={styles.scoreItemValue}>
                  {receipt.scores.sentiment}/10
                </Text>
              </View>
            </View>

            <View style={styles.totalRow}>
              <Text>TOTAL</Text>
              <Text>{receipt.scores.overall}/10</Text>
            </View>

            <View style={styles.divider} />

            {/* The Alpha */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>+ THE ALPHA</Text>
              {receipt.theAlpha.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>+</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            {/* The Friction */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>! THE FRICTION</Text>
              {receipt.theFriction.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>!</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            {/* Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>&gt; RECOMMENDATIONS</Text>
              {receipt.recommendations.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bullet}>&gt;</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.stars}>********************************</Text>
          <Text style={styles.footerText}>THANK YOU FOR SHOPPING</Text>
          <Text style={styles.footerText}>AT BODEGA RESEARCH</Text>
          <Text style={styles.stars}>********************************</Text>

          {/* Verified Stamp */}
          {isVerified && (
            <View style={styles.verifiedStamp}>
              <Text style={styles.verifiedText}>BODEGA VERIFIED</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
