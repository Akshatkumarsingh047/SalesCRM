import DashboardHeader from "@/components/dashboard/DashboardHeader";

import { setAssignLeads } from "@/store/assignedLeadSlice";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext"; // adjust path if needed
import Loading from "@/components/ui/Loading";

export default function DashboardScreen() {
  const { darkMode, toggleTheme } = useTheme();
  const agentEmail = useSelector((state: any) => state.agent.assignedTo);
  const dispatch = useDispatch();
  const [loading,setLoading]=useState(false)

  useEffect(() => {
  const allTypes = async () => {
    try {
      setLoading(true);
      // Optional delay (e.g., simulate spinner time or wait for UI to settle)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const res = await fetch(`${apiUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: agentEmail }),
      });

      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      dispatch(setAssignLeads(data));
    } catch (error) {
      console.error("Error loading leads:", error);
      // Optionally show a toast or set an error state
    } finally {
      setLoading(false);
    }
  };

  allTypes();
}, [agentEmail]);


  const {
    busy,
    converted,
    demo,
    dnp,
    dormants,
    emails,
    "call me later": callMeLater,
    "not interested": notInterested,
    "out of station": outOfStation,
    "wrong number": wrongNumber,
  } = useSelector((state: any) => state.leads.assignedGroupLeads);

  const statusBoxes = [
    {
      title: "DNP",
      count: dnp?.length ?? 0,
      color: "#1D4ED8", // Royal Blue
      bgColor: "#D6E4FF", // Light Blue
      status: "dnp",
      route: "/dnp",
    },
    {
      title: "Demo",
      count: demo?.length ?? 0,
      color: "#F59E0B", // Amber
      bgColor: "#FFEFC7", // Warm Yellow
      status: "demo",
      route: "/demo",
    },
    {
      title: "Call me Later",
      count: callMeLater?.length ?? 0,
      color: "#10B981", // Emerald Green
      bgColor: "#D1FADF", // Bright Mint
      status: "call me later",
      route: "/callmelater",
    },
    {
      title: "Wrong Number",
      count: wrongNumber?.length ?? 0,
      color: "#DC2626", // Soft Red
      bgColor: "#FFD6D6", // Prominent Pink-Red
      status: "Wrong Number",
      route: "/wrong number",
    },
    {
      title: "Converted",
      count: converted?.length ?? 0,
      color: "#9333EA", // Deep Purple
      bgColor: "#E9D5FF", // Lilac
      status: "Converted",
      route: "/converted",
    },
    {
      title: "Busy",
      count: busy?.length ?? 0,
      color: "#0EA5E9", // Cyan Blue
      bgColor: "#C7F0FF", // Light Cyan
      status: "busy",
      route: "/busy",
    },
    {
      title: "Emails",
      count: emails?.length ?? 0,
      color: "#0D9488", // Teal Green (distinct from violet)
      bgColor: "#CCFBF1", // Soft Aqua-Mint
      status: "email",
      route: "/emails",
    },
    {
      title: "Out of station",
      count: outOfStation?.length ?? 0,
      color: "#D97706", // Warm Amber (Orange-Brown)
      bgColor: "#FFF3D9", // Light Tan/Peach
      status: "out of station",
      route: "/outofstation",
    },
    {
      title: "Not Interested",
      count: notInterested?.length ?? 0,
      color: "#6B7280", // Cool Gray
      bgColor: "#E5E7EB", // Light Gray
      status: "not interested",
      route: "/not interested",
    },
    {
      title: "Dormants",
      count: dormants?.length ?? 0,
      color: "#EC4899", // Pink
      bgColor: "#FFD6EC", // Light Pink
      status: "later",
      route: "/dormants",
    },
  ];

const handleStatusPress = (box: any) => {
  if (!box?.route || !box?.status) return;

  router.push({
    pathname: box.route,
     // Ensure consistent status
  });
};


  return (
    <SafeAreaView
      style={[styles.container, darkMode && { backgroundColor: "#222" }]}
      edges={["top"]}
    >
      <DashboardHeader />
      {loading?<Loading/>:<ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, darkMode && { color: "#fff" }]}>
          Lead Status Overview
        </Text>

        <View style={styles.statusGrid}>
          {statusBoxes.map((box, index) => (
            <TouchableOpacity
              key={box.status}
              style={[styles.statusBox, { backgroundColor: box.bgColor }]}
              onPress={() => handleStatusPress(box)}
            >
              <View style={styles.box1}>
                <Text
                  style={[styles.statusNumber, darkMode && { color: "#000" }]}
                >
                  {box.count}
                </Text>
                <Text
                  style={[styles.statusTitle, darkMode && { color: "#000" }]}
                >
                  {box.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#333",
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingBottom: 70,
  },
  statusBox: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusNumber: {
    fontSize: 36,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#333",
    textAlign: "center",
  },

  box1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
