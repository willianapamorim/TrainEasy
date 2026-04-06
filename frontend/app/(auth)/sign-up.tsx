import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { SocialButton } from "@/src/components/SocialButton";
import { COLORS } from "@/src/constants/colors";
import { registerUser } from "@/src/services/authService";
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

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const router = useRouter();

  async function handleSignUp() {
    if (!name || !email || !password || !repeatPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const response = await registerUser({
        nome: name,
        email,
        senha: password,
      });

      if (response.success && response.user) {
        await saveUser(response.user);
        Alert.alert("Sucesso", response.message, [
          { text: "OK", onPress: () => router.replace("/(tabs)/home") },
        ]);
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
          <Text style={styles.title}>Crie sua conta aqui</Text>

          {/* Formulário */}
          <View style={styles.form}>
            <Input placeholder="Nome*" value={name} onChangeText={setName} />

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

            <Input
              placeholder="Repeat Password*"
              secureTextEntry
              value={repeatPassword}
              onChangeText={setRepeatPassword}
            />
          </View>

          {/* Política de Privacidade */}
          <Text style={styles.policyText}>
            Ao se cadastrar neste aplicativo, você também concorda com nossos{" "}
            <Text style={styles.link} onPress={() => {}}>
              Termos de Serviço
            </Text>{" "}
            e{" "}
            <Text style={styles.link} onPress={() => {}}>
              Política de Privacidade
            </Text>
            .
          </Text>

          {/* Botão Cadastrar */}
          <Button title="Cadastre-se" onPress={handleSignUp} />

          {/* Link para Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Você já tem uma conta? </Text>
            <Link href="/(auth)/sign-in" style={styles.loginLink}>
              Fazer Login
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
    gap: 16,
  },
  policyText: {
    fontSize: 15,
    color: COLORS.gray,
    lineHeight: 20,
    marginTop: 40,
    marginBottom: 24,
  },
  link: {
    color: COLORS.link,
    textDecorationLine: "underline",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginText: {
    fontSize: 15,
    color: COLORS.gray,
  },
  loginLink: {
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
