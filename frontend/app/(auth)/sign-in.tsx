import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { SocialButton } from "@/src/components/SocialButton";
import { COLORS } from "@/src/constants/colors";
import { loginUser } from "@/src/services/authService";
import { saveUser } from "@/src/services/storage";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await loginUser({ email, senha: password });

      if (response.success && response.user) {
        await saveUser(response.user);
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Erro", response.message);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título */}
          <Text style={styles.brand}>TrainEasy</Text>

          {/* Subtítulo */}
          <Text style={styles.title}>Entre em sua conta</Text>

          {/* Formulário */}
          <View style={styles.form}>
            <Input
              placeholder="E-mail*"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              placeholder="Password*"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
              Esqueceu a senha?
            </Link>
          </View>

          {/* Botão Entrar */}
          <Button title="Entrar" onPress={handleSignIn} />

          {/* Link para Cadastro */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Você não tem uma conta? </Text>
            <Link href="/(auth)/sign-up" style={styles.signUpLink}>
              Cadastre-se
            </Link>
          </View>

          {/* Ícones Sociais */}
          <View style={styles.socialContainer}>
            <SocialButton icon="google" />
            <SocialButton icon="facebook" />
            <SocialButton icon="phone" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  brand: {
    fontSize: 45,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "left",
  },
  title: {
    fontSize: 33,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: 56,
    textAlign: "left",
  },
  form: {
    marginTop: 24,
    marginBottom: 40,
    gap: 16,
  },
  forgotLink: {
    fontSize: 14,
    color: COLORS.link,
    fontWeight: "600",
    textAlign: "right",
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signUpText: {
    fontSize: 15,
    color: COLORS.gray,
  },
  signUpLink: {
    fontSize: 15,
    color: COLORS.link,
    fontWeight: "600",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 60,
  },
});
