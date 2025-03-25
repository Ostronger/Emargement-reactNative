import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import styles, { signatureWebStyle } from '../styles/signature.style';

export default function SignaturePage() {
  const ref = useRef<any>();

  const handleOK = (signature: string) => {
    console.log('Signature capturée ✅', signature);
    Alert.alert('Signature sauvegardée ✅');
    // Tu peux envoyer la signature au backend ici
  };

  const handleEmpty = () => {
    Alert.alert('Erreur', 'Signature vide ❌');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/gefor.jpg')}
        style={styles.logo}
      />

      <Text style={styles.title}>Emargement</Text>
      <Text style={styles.subtitle}>veuillez signer dans le cadre</Text>

      <View style={styles.signatureContainer}>
      <SignatureScreen
  ref={ref}
  onOK={handleOK}
  onEmpty={handleEmpty}
  descriptionText=""
  webStyle={signatureWebStyle}
/>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => ref.current?.readSignature()}
      >
        <Text style={styles.saveButtonText}>Sauvegarder</Text>
      </TouchableOpacity>
    </View>
  );
}