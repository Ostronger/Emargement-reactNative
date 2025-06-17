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
  modalContent: ViewStyle;
}

// ✅ Styles React Native
const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'center',
  },

  modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fond assombri
  justifyContent: 'center',
  alignItems: 'center',
},

modalContent: {
  width: '90%',
  backgroundColor: '#f1f5f9',
  borderRadius: 16,
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 8,
},

  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  signatureContainer: {
  height: 250,
  backgroundColor: '#f8fafc',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#94a3b8',
  marginBottom: 20,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
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
  .m-signature-pad {
    box-shadow: none;
    border: none;
  }

  .m-signature-pad--body {
    background-color: #f8fafc;
    border-radius: 12px;
    position: relative;
  }

  .m-signature-pad--footer {
    display: none;
  }

  .m-signature-pad--body::before {
    content: 'SIGNEZ ICI';
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 22px;
    color: rgba(0, 0, 0, 0.15);
    font-weight: bold;
    text-align: center;
    width: 100%;
    pointer-events: none;
  }
`;

export default styles;