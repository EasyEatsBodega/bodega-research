/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import type { Review } from "@/types";

// Register a monospace font (Space Mono would be ideal, using Courier as fallback)
Font.register({
  family: "Courier",
  src: "https://fonts.gstatic.com/s/courierprime/v9/u-450q2lgwslOqpF_6gQ8kELWwZj.woff2",
});

// Color helpers
const getScoreColor = (score: number): string => {
  if (score >= 8) return "#22c55e"; // green
  if (score >= 6) return "#F0A202"; // gold
  if (score >= 4) return "#F18805"; // orange
  return "#D95D39"; // coral/red
};

const getScoreLabel = (score: number): string => {
  if (score >= 8) return "FRESH";
  if (score >= 6) return "DECENT";
  if (score >= 4) return "STALE";
  return "FLOP";
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f5f5dc",
    padding: 20,
    fontFamily: "Courier",
    fontSize: 10,
    color: "#1a1a1a",
    width: 300,
  },
  header: {
    textAlign: "center",
    marginBottom: 15,
    alignItems: "center",
  },
  bodegaLogo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    objectFit: "contain",
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
  verdictLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 5,
    letterSpacing: 2,
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
  // Score bars
  scoreBarContainer: {
    marginVertical: 8,
  },
  scoreBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreBarLabel: {
    width: 45,
    fontSize: 8,
    color: "#666",
  },
  scoreBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginHorizontal: 5,
  },
  scoreBarFill: {
    height: 8,
    borderRadius: 4,
  },
  scoreBarValue: {
    width: 25,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "right",
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
  // Market Intelligence
  marketSection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#e8e8d0",
    borderRadius: 5,
  },
  marketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  marketLabel: {
    fontSize: 8,
    color: "#666",
  },
  marketValue: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  marketTrendsTitle: {
    fontSize: 8,
    color: "#666",
    marginTop: 6,
    marginBottom: 4,
  },
  marketTrendItem: {
    fontSize: 7,
    color: "#444",
    marginLeft: 5,
    marginBottom: 2,
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
  // Logo styles
  logoContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "contain",
    borderRadius: 5,
  },
  // Page 2 styles
  page2Header: {
    textAlign: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: "2px dashed #ccc",
  },
  page2Title: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  page2Subtitle: {
    fontSize: 8,
    color: "#666",
    marginTop: 3,
  },
  analystSection: {
    marginVertical: 10,
  },
  analystTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  analystText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: "#333",
    textAlign: "justify",
  },
  bodegaTakeSection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff8e1",
    borderRadius: 5,
    borderLeft: "3px solid #F0A202",
  },
  bodegaTakeTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#F0A202",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bodegaTakeText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: "#333",
  },
  marketTrendsList: {
    marginTop: 8,
  },
  marketTrendRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  marketTrendArrow: {
    width: 12,
    fontSize: 8,
    color: "#F0A202",
  },
  marketTrendText: {
    flex: 1,
    fontSize: 7,
    color: "#444",
    lineHeight: 1.4,
  },
  continuedText: {
    fontSize: 7,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});

interface ReceiptTemplateProps {
  review: Review;
  logoUrl?: string; // Direct URL to the Bodega Research logo
}

// Score bar component
function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = getScoreColor(score);
  const widthPercent = (score / 10) * 100;

  return (
    <View style={styles.scoreBarRow}>
      <Text style={styles.scoreBarLabel}>{label}</Text>
      <View style={styles.scoreBarTrack}>
        <View
          style={[
            styles.scoreBarFill,
            { width: `${widthPercent}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={[styles.scoreBarValue, { color }]}>{score.toFixed(1)}</Text>
    </View>
  );
}

export function ReceiptTemplate({ review, logoUrl }: ReceiptTemplateProps) {
  const receipt = review.ai_data?.publicReceipt;
  const marketIntel = review.ai_data?.marketIntelligence;
  const bodegaTake = review.raw_notes?.my_recommendations;
  const score = review.rating_score || 0;
  const isVerified = score >= 8;
  const verdict = getScoreLabel(score);
  const verdictColor = getScoreColor(score);
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Check if we have content for page 2 (Bodega's Take or Market Trends)
  const hasPage2Content = bodegaTake || (marketIntel?.marketTrends && marketIntel.marketTrends.length > 0);

  return (
    <Document>
      <Page size={{ width: 300, height: "auto" }} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {logoUrl && (
            <Image
              src={logoUrl}
              style={styles.bodegaLogo}
            />
          )}
          <Text style={styles.title}>BODEGA RESEARCH</Text>
          <Text style={styles.subtitle}>*** WEB3 DUE DILIGENCE ***</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.divider} />

        {/* Project Logo - Only render if we have a valid URL */}
        {review.brand_image_url && review.brand_image_url.startsWith('http') && (
          <View style={styles.logoContainer}>
            <Image
              src={review.brand_image_url}
              style={styles.logo}
              cache={false}
            />
          </View>
        )}

        {/* Project Name */}
        <Text style={styles.projectName}>{review.project_name}</Text>

        {/* Overall Score with Verdict */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>OVERALL SCORE</Text>
          <Text style={styles.scoreValue}>{score.toFixed(1)}/10</Text>
          <Text style={[styles.verdictLabel, { color: verdictColor }]}>
            {verdict}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Content sections - Alpha, Friction, Recommendations first */}
        {receipt && (
          <>
            {/* The Alpha */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>+ THE ALPHA</Text>
              {receipt.theAlpha.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={[styles.bullet, { color: "#22c55e" }]}>+</Text>
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
                  <Text style={[styles.bullet, { color: "#D95D39" }]}>!</Text>
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
                  <Text style={[styles.bullet, { color: "#F0A202" }]}>&gt;</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Market Intelligence */}
        {marketIntel && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionHeader}>$ MARKET INTEL</Text>
            <View style={styles.marketSection}>
              <View style={styles.marketRow}>
                <Text style={styles.marketLabel}>Sector:</Text>
                <Text style={styles.marketValue}>{marketIntel.sector}</Text>
              </View>
              <View style={styles.marketRow}>
                <Text style={styles.marketLabel}>TAM:</Text>
                <Text style={styles.marketValue}>{marketIntel.tam}</Text>
              </View>
              <View style={styles.marketRow}>
                <Text style={styles.marketLabel}>Growth:</Text>
                <Text style={styles.marketValue}>{marketIntel.tamGrowthRate}</Text>
              </View>
              <View style={styles.marketRow}>
                <Text style={styles.marketLabel}>Maturity:</Text>
                <Text style={styles.marketValue}>{marketIntel.marketMaturity}</Text>
              </View>
              <View style={styles.marketRow}>
                <Text style={styles.marketLabel}>Entry Barrier:</Text>
                <Text style={styles.marketValue}>{marketIntel.entryBarrier}</Text>
              </View>
              {marketIntel.keyCompetitors?.length > 0 && (
                <View style={styles.marketRow}>
                  <Text style={styles.marketLabel}>Competitors:</Text>
                  <Text style={styles.marketValue}>
                    {marketIntel.keyCompetitors.slice(0, 3).join(", ")}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Item Breakdown at bottom - like a real receipt */}
        {receipt && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionHeader}>ITEM BREAKDOWN</Text>
            <View style={styles.scoreBarContainer}>
              <ScoreBar label="PMF" score={receipt.scores.pmf} />
              <ScoreBar label="UI/UX" score={receipt.scores.ui} />
              <ScoreBar label="VIBE" score={receipt.scores.sentiment} />
            </View>

            <View style={styles.totalRow}>
              <Text>TOTAL</Text>
              <Text style={{ color: verdictColor }}>
                {receipt.scores.overall.toFixed(1)}/10
              </Text>
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

          {/* Continued indicator */}
          {hasPage2Content && (
            <Text style={styles.continuedText}>... CONTINUED ON NEXT PAGE ...</Text>
          )}
        </View>
      </Page>

      {/* PAGE 2 - Analyst Report & Bodega's Take */}
      {hasPage2Content && (
        <Page size={{ width: 300, height: "auto" }} style={styles.page}>
          {/* Page 2 Header */}
          <View style={styles.page2Header}>
            <Text style={styles.page2Title}>{review.project_name}</Text>
            <Text style={styles.page2Subtitle}>DETAILED ANALYSIS</Text>
          </View>

          {/* Bodega's Take - Featured at top */}
          {bodegaTake && (
            <>
              <View style={styles.bodegaTakeSection}>
                <Text style={styles.bodegaTakeTitle}>☆ EASY&apos;S TAKE</Text>
                <Text style={styles.bodegaTakeText}>{bodegaTake}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Market Trends - If available */}
          {marketIntel?.marketTrends && marketIntel.marketTrends.length > 0 && (
            <>
              <View style={styles.analystSection}>
                <Text style={styles.analystTitle}>→ MARKET TRENDS</Text>
                <View style={styles.marketTrendsList}>
                  {marketIntel.marketTrends.map((trend, i) => (
                    <View key={i} style={styles.marketTrendRow}>
                      <Text style={styles.marketTrendArrow}>→</Text>
                      <Text style={styles.marketTrendText}>{trend}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          <View style={styles.divider} />

          {/* Page 2 Footer */}
          <View style={styles.footer}>
            <Text style={styles.stars}>********************************</Text>
            <Text style={styles.footerText}>BODEGA RESEARCH</Text>
            <Text style={styles.footerText}>{date}</Text>
            <Text style={styles.stars}>********************************</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}
