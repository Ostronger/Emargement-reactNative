import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  logo: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
  signatureContainer: ViewStyle;
  saveButton: ViewStyle;
  saveButtonText: TextStyle;
  modalContainer: ViewStyle; 
}

// ✅ Styles React Native
const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 20,
    justifyContent: 'center',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 20,
    justifyContent: 'center',
  },

  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  signatureContainer: {
    height: 250,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#d1d5db',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#0a1b52',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// ✅ CSS string pour le canvas (export nommé)
export const signatureWebStyle = `
  .m-signature-pad--footer {
    display: none;
  }
  .m-signature-pad--body {
    background-color: #d1d5db;
  }
  .m-signature-pad--body::before {
    content: 'SIGNEZ ICI';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: rgba(0, 0, 0, 0.2);
    font-weight: bold;
  }
`;

export default styles;