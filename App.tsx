import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type OrbState = "idle" | "listening" | "thinking" | "working" | "done";

const stateText: Record<OrbState, string> = {
  idle: "Hello, Boss.",
  listening: "I'm listening, Boss.",
  thinking: "Thinking...",
  working: "Working on it...",
  done: "Done, Boss.",
};

export default function App() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const [state, setState] = useState<OrbState>("idle");

  const pulse = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    breathing.start();

    const rotation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotation.start();

    return () => {
      breathing.stop();
      rotation.stop();
    };
  }, [pulse, spin]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: state === "working" ? [0.98, 1.08] : [1, 1.045],
  });

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const nextState = () => {
    if (state === "idle") setState("listening");
    else if (state === "listening") setState("thinking");
    else if (state === "thinking") setState("working");
    else if (state === "working") setState("done");
    else setState("idle");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.container, landscape && styles.landscape]}>
        <View style={styles.header}>
          <Text style={styles.brand}>OMNEX</Text>
          <Text style={styles.subtitle}>YOUR AI UNIVERSE</Text>
        </View>

        <View style={[styles.main, landscape && styles.mainLandscape]}>
          <View style={styles.orbArea}>
            <Animated.View
              style={[
                styles.orb,
                { transform: [{ scale }] },
                state === "listening" && styles.listeningOrb,
                state === "thinking" && styles.thinkingOrb,
                state === "working" && styles.workingOrb,
                state === "done" && styles.doneOrb,
              ]}
            >
              <View style={styles.core}>
                <Text style={styles.infinity}>∞</Text>
              </View>

              <Animated.View
                style={[styles.ring, styles.ringOne, { transform: [{ rotate }] }]}
              />
              <Animated.View
                style={[styles.ring, styles.ringTwo, { transform: [{ rotate: "60deg" }, { rotate }] }]}
              />

              <View style={[styles.particle, styles.p1]} />
              <View style={[styles.particle, styles.p2]} />
              <View style={[styles.particle, styles.p3]} />
              <View style={[styles.particle, styles.p4]} />
            </Animated.View>
          </View>

          <View style={styles.content}>
            <Text style={styles.greeting}>{stateText[state]}</Text>
            <Text style={styles.helper}>
              {state === "idle"
                ? "Your AI partner. What would you like to build today?"
                : "OMNEX is processing your command."}
            </Text>

            <Pressable style={styles.talkButton} onPress={nextState}>
              <Text style={styles.mic}>◉</Text>
              <Text style={styles.talkText}>
                {state === "idle" ? "TAP TO SPEAK" : "OMNEX ACTIVE"}
              </Text>
            </Pressable>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomItem}>ACTIVITY</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.bottomItem}>PROJECTS</Text>
            </View>
          </View>
        </View>

        <Text style={styles.status}>OMNEX • ONLINE</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#05070d" },
  container: {
    flex: 1,
    backgroundColor: "#05070d",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 14,
  },
  landscape: { paddingHorizontal: 38 },
  header: { alignItems: "center" },
  brand: {
    color: "#eef7ff",
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: 6,
  },
  subtitle: {
    color: "#6c8ca8",
    fontSize: 9,
    letterSpacing: 2.5,
    marginTop: 4,
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainLandscape: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  orbArea: {
    width: 310,
    height: 310,
    alignItems: "center",
    justifyContent: "center",
  },
  orb: {
    width: 225,
    height: 225,
    borderRadius: 112.5,
    borderWidth: 2,
    borderColor: "#39bfff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#20aaff",
    shadowOpacity: 0.8,
    shadowRadius: 32,
    elevation: 20,
  },
  listeningOrb: { borderColor: "#8b7cff" },
  thinkingOrb: { borderColor: "#b46cff" },
  workingOrb: { borderColor: "#42e6ff" },
  doneOrb: { borderColor: "#55f2bd" },
  core: {
    width: 155,
    height: 155,
    borderRadius: 78,
    backgroundColor: "#071426",
    borderWidth: 1,
    borderColor: "#7bdcff",
    alignItems: "center",
    justifyContent: "center",
  },
  infinity: {
    color: "#e7fbff",
    fontSize: 78,
    fontWeight: "200",
    textShadowColor: "#43cfff",
    textShadowRadius: 18,
  },
  ring: {
    position: "absolute",
    width: 285,
    height: 72,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#2bbcff",
  },
  ringOne: { transform: [{ rotate: "22deg" }] },
  ringTwo: { opacity: 0.45 },
  particle: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#b9f4ff",
  },
  p1: { top: 20, left: 78 },
  p2: { top: 72, right: 14 },
  p3: { bottom: 32, left: 36 },
  p4: { bottom: 82, right: 30 },
  content: {
    alignItems: "center",
    maxWidth: 430,
  },
  greeting: {
    color: "#f1f7ff",
    fontSize: 27,
    fontWeight: "500",
    textAlign: "center",
  },
  helper: {
    color: "#7891a8",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 330,
  },
  talkButton: {
    marginTop: 25,
    minWidth: 205,
    height: 52,
    paddingHorizontal: 25,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "#416dff",
    backgroundColor: "#0a1024",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  mic: { color: "#8e9cff", fontSize: 18 },
  talkText: {
    color: "#e9f0ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    gap: 10,
  },
  bottomItem: {
    color: "#6f8ca5",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  dot: { color: "#39bfff" },
  status: {
    textAlign: "center",
    color: "#3c6078",
    fontSize: 9,
    letterSpacing: 2,
  },
});
