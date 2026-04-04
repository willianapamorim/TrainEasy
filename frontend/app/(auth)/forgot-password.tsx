import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { COLORS } from "@/src/constants/colors";
import { forgotPassword, resetPassword } from "@/src/services/authService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Step = "email" | "code";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSendCode() {
    if (!email) {
      Alert.alert("Erro", "Preencha o e-mail.");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword({ email });
      if (response.success) {
        Alert.alert("Sucesso", response.message);
        setStep("code");
      } else {
        Alert.alert("Erro", response.message);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!code || !novaSenha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ email, code, novaSenha });
      if (response.success) {
        Alert.alert("Sucesso", "Senha alterada com sucesso!", [
          { text: "OK", onPress: () => router.replace("/(auth)/sign-in") },
        ]);
      } else {
        Alert.alert("Erro", response.message);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.brand}>TrainEasy</Text>
          <Text style={styles.title}>Recuperar Senha</Text>

          {step === "email" ? (
            <>
              <Text style={styles.description}>
                Informe o e-mail cadastrado para receber o código de
                recuperação.
              </Text>

              <View style={styles.form}>
                <Input
                  placeholder="E-mail*"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <Button
                title={loading ? "Enviando..." : "Enviar Código"}
                onPress={handleSendCode}
                disabled={loading}
              />
            </>
          ) : (
            <>
              <Text style={styles.description}>
                Digite o código de 6 dígitos enviado para {email} e defina sua
                nova senha.
              </Text>

              <View style={styles.form}>
                <Input
                  placeholder="Código de 6 dígitos*"
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={setCode}
                  maxLength={6}
                />

                <Input
                  placeholder="Nova senha*"
                  secureTextEntry
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                />

                <Input
                  placeholder="Confirmar nova senha*"
                  secureTextEntry
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
              </View>

              <Button
                title={loading ? "Alterando..." : "Alterar Senha"}
                onPress={handleResetPassword}
                disabled={loading}
              />

              <TouchableOpacity
                onPress={handleSendCode}
                style={styles.resendContainer}
              >
                <Text style={styles.resendText}>Reenviar código</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backContainer}
          >
            <Text style={styles.backText}>Voltar ao login</Text>
          </TouchableOpacity>
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
  description: {
    fontSize: 15,
    color: COLORS.gray,
    marginTop: 16,
    lineHeight: 22,
  },
  form: {
    marginTop: 24,
    marginBottom: 40,
    gap: 16,
  },
  resendContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  resendText: {
    fontSize: 15,
    color: COLORS.link,
    fontWeight: "600",
  },
  backContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  backText: {
    fontSize: 15,
    color: COLORS.gray,
  },
});
