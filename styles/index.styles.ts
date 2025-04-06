import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  mainTitle: TextStyle;
  imageBlock: ViewStyle;
  imageTitle: TextStyle;
  image: ImageStyle;
  imageDescription: TextStyle;
}

export default StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'flex-start',
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },

  imageBlock: {
    marginBottom: 30,
    alignItems: 'center',
  },

  imageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },

  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  imageDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    paddingHorizontal: 10,
  },
});