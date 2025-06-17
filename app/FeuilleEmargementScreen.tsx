import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignatureScreen from "react-native-signature-canvas";
import signatureStyles, { signatureWebStyle } from "../styles/signature.style";
import { User } from "../types/types";

export default function FeuilleEmargementScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [session, setSession] = useState<any>(null);
  const ref = useRef<any>(null);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(
          `${apiUrl}/api/apprenant/signature/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();
        setSession(data);
      } catch (err) {
        Alert.alert("Erreur", "Impossible de charger les données.");
      }
    };

    if (sessionId) fetchSession();
  }, [sessionId]);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      setUser(parsedUser);
    };

    loadUser();
  }, []);

  const handleOK = async (signature: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        `${apiUrl}/api/apprenant/signature/${sessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ signatureData: signature }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        Alert.alert("Succès", result.message || "Signature enregistrée");
        setSession({ ...session, alreadySigned: true });
      } else {
        Alert.alert("Erreur", result.message || "Échec de la signature");
      }
    } catch (err) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l’envoi de la signature."
      );
    } finally {
      setShowModal(false);
    }
  };

  const handleEmpty = () => {
    Alert.alert("Erreur", "Signature vide");
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const { active, alreadySigned, formation, salle, horaire, formateur } =
    session;

  const getInitiales = () => {
    if (!user) return "??";
    const prenom = user.firstname?.charAt(0) || "";
    const nom = user.lastname?.charAt(0) || "";
    return `${prenom}${nom}`.toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push("/(tabs)/Profil")}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitiales()}</Text>
          </View>
        </TouchableOpacity>
        <Image
          source={require("../assets/images/gefor.jpg")}
          style={styles.logo}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.welcome}>Bonjour Apprenant</Text>
        <TouchableOpacity
          style={styles.absenceBtn}
          onPress={() => router.push("/Accueil/justificatif")}
        >
          <Text style={styles.absenceBtnText}>Justifier une absence</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{formation}</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>
          <FontAwesome5
            name="book-open"
            size={16}
            color="#E85421"
            style={{ marginRight: 8 }}
          />{" "}
          {formation} - Salle : {salle}
        </Text>
        <Text style={styles.cardTime}>{horaire}</Text>
        <Text style={styles.cardProf}>
          <FontAwesome5
            name="user-tie"
            size={16}
            color="#0E1E5B"
            style={{ marginRight: 6 }}
          />{" "}
          Intervenant
        </Text>
        <Text style={styles.profName}>{formateur}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.signBtn,
          (!active || alreadySigned) && styles.signBtnDisabled,
        ]}
        onPress={() => {
          if (alreadySigned) {
            Alert.alert("Déjà signé", "Vous avez déjà signé cette session.");
          } else if (!active) {
            Alert.alert(
              "Session inactive",
              "La session n’est pas encore active."
            );
          } else {
            setShowModal(true);
          }
        }}
        disabled={!active || alreadySigned}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5
            name={alreadySigned ? "check-circle" : active ? "signature" : "ban"}
            size={16}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.signBtnText}>
            {alreadySigned
              ? "Déjà signé"
              : active
              ? "Signer"
              : "Session inactive"}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={signatureStyles.modalContainer}>
          <View style={signatureStyles.modalContent}>
            <Text style={signatureStyles.title}>
              Veuillez signer dans le cadre
            </Text>

            <View style={signatureStyles.signatureContainer}>
              <SignatureScreen
                ref={ref}
                onOK={handleOK}
                onEmpty={handleEmpty}
                descriptionText=""
                webStyle={signatureWebStyle}
              />
            </View>

            <TouchableOpacity
              style={signatureStyles.saveButton}
              onPress={() => ref.current?.readSignature()}
            >
              <Text style={signatureStyles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text
                style={{ textAlign: "center", color: "#E85421", marginTop: 10 }}
              >
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3F5",
    paddingTop: 20,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  avatar: {
    backgroundColor: "#E85421",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  logo: {
    width: 160,
    height: 50,
    resizeMode: "contain",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginTop: 12,
  },
  welcome: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0E1E5B",
  },
  absenceBtn: {
    backgroundColor: "#0E1E5B",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  absenceBtnText: {
    color: "white",
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
  },
  sectionTitle: {
    backgroundColor: "#dee2e6",
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: "#212529",
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 10,
  },
  cardTime: {
    color: "#6C757D",
    marginTop: 4,
    fontStyle: "italic",
  },
  cardProf: {
    fontWeight: "bold",
    marginTop: 10,
    color: "#212529",
  },
  profName: {
    color: "#212529",
    fontWeight: "500",
    marginTop: 4,
  },
  signBtn: {
    backgroundColor: "#0E1E5B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 80,
    shadowColor: "#000",
  },
  signBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    gap: 8,
  },

  signBtnDisabled: {
    backgroundColor: "#ccc",
  },
});
