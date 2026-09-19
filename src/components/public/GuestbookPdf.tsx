import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { saveAs } from "../../utils/saveAs";
import type { GuestMessage, Wedding, WeddingTheme } from "../../types";

function createStyles(theme: WeddingTheme) {
  return StyleSheet.create({
    page: {
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      display: "flex",
      flexDirection: "column",
    },
    accentBar: { height: 12, backgroundColor: theme.primaryColor },
    content: {
      padding: 60,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    wedding: {
      fontSize: 12,
      color: theme.primaryColor,
      textAlign: "center",
      marginBottom: 10,
      letterSpacing: 1.5,
    },
    date: { fontSize: 10, color: theme.secondaryColor, textAlign: "center", marginBottom: 32 },
    messageBox: {
      width: "100%",
      padding: 34,
      borderWidth: 1,
      borderColor: theme.accentColor,
      backgroundColor: theme.accentColor,
      display: "flex",
      alignItems: "center",
    },
    message: { fontSize: 20, lineHeight: 1.6, color: theme.textColor, textAlign: "center", marginBottom: 18 },
    name: { fontSize: 11, color: theme.primaryColor, textAlign: "center" },
    pageNumber: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
      color: theme.secondaryColor,
    },
  });
}

function GuestbookDocument({ wedding, messages }: { wedding: Wedding; messages: GuestMessage[] }) {
  const theme = wedding.theme;
  const styles = createStyles(theme);

  return (
    <Document>
      {messages.map((m, pageIdx) => (
        <Page key={m.id} size="A4" style={styles.page}>
          <View style={styles.accentBar} />
          <View style={styles.content}>
            <Text style={styles.wedding}>{wedding.brideName} &amp; {wedding.groomName}</Text>
            <Text style={styles.date}>{new Date(wedding.weddingDate).toDateString()}</Text>
            <View style={styles.messageBox}>
              <Text style={styles.message}>{m.message}</Text>
              <Text style={styles.name}>— {m.name}</Text>
            </View>
          </View>
          <Text style={styles.pageNumber}>{pageIdx + 1}</Text>
        </Page>
      ))}
    </Document>
  );
}

export async function exportGuestbookPdf(wedding: Wedding, messages: GuestMessage[]) {
  const blob = await pdf(<GuestbookDocument wedding={wedding} messages={messages} />).toBlob();
  saveAs(blob, `${wedding.slug}-guestbook.pdf`);
}
