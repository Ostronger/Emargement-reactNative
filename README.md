# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

📡 Connexion à l’API avec Expo et les variables .env

Ce projet utilise une API Symfony sécurisée avec JWT. Pour des raisons de sécurité, le fichier .env n’est pas inclus dans le dépôt. Chaque collaborateur doit créer ce fichier manuellement avant de lancer l’application.

✅ Étapes pour configurer l’API dans l’application mobile :

1. Créer un fichier .env

Dans la racine du projet React Native, crée un fichier nommé .env (sans extension).

Ajoute la ligne suivante en remplaçant par l’URL de ton API :

EXPO_PUBLIC_API_URL=http://192.168.xx.xx:8000

🔁 Utilise l’adresse IP locale de ton ordinateur, visible dans ifconfig (Mac/Linux) ou ipconfig (Windows). Assure-toi que ton téléphone et ton ordinateur sont sur le même réseau Wi-Fi.

2. Vérifier l’appel API dans le code

Dans le code, l’URL de l’API est récupérée avec :

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

L’appel est ensuite fait comme ceci :

const response = await fetch(`${apiUrl}/api/login`, { ... });

✅ Cela permet d’éviter de stocker l’URL de l’API en dur dans le code source.

3. Ne pas versionner le fichier .env

Assure-toi que le fichier .env est bien ignoré par Git (déjà présent dans .gitignore du projet).

4. Exemple de contenu .env

EXPO_PUBLIC_API_URL=http://192.168.1.100:8000

5. Bonnes pratiques
	•	Redémarre Expo avec npx expo start après avoir modifié .env.
	•	Évite les trailing slashes (/) à la fin de l’URL.
	•	Ne pas utiliser localhost sur mobile — toujours une IP locale (ex: 192.168.x.x).
	•	Utilise un tunnel (ex: ngrok) si besoin d’accéder à l’API depuis un autre réseau.

# 📲 Fonctionnalité : Signature Numérique - Application Mobile & API Symfony

Cette fonctionnalité permet aux apprenants de signer leur présence à une session de formation depuis leur mobile. Elle est intégrée à l’application mobile (React Native) et connectée à l’API Symfony sécurisée avec JWT.

---

## ✅ Fonctionnalité côté mobile

**Fichier principal :** `FeuilleEmargementScreen.tsx`  
**Librairie utilisée :** `react-native-signature-canvas`

### Fonctionnalités :
- ✅ Affichage des informations de la session (formation, salle, formateur, horaire)
- ✅ Vérification que la session est **active**
- ✅ Empêche la signature si la session est inactive ou déjà signée
- ✅ Signature via un modal avec canvas intégré
- ✅ Envoi des données via `fetch` avec JWT dans l'en-tête

### Données utilisées :
- `session.active` : indique si la session est activée par le formateur
- `session.alreadySigned` : booléen pour savoir si l’apprenant a déjà signé

### Endpoints utilisés :
- `GET /api/apprenant/signature/{id}` : récupère les données de la session
- `POST /api/apprenant/signature/{id}` : envoie la signature encodée en base64

---

## 🔐 Côté API Symfony (`SignatureController.php`)

### 🔧 Endpoints :

| Méthode | URL | Description |
|--------|-----|-------------|
| GET | `/api/apprenant/signature/{id}` | Retourne les infos de session + statut de signature |
| POST | `/api/apprenant/signature/{id}` | Enregistre la signature (data URL) |
| DELETE | `/api/apprenant/signature-session/{id}/delete` | Supprime une signature (pour tests ou réinitialisation) |

### ⚠️ Vérifications effectuées :
- 🔐 L’utilisateur doit avoir le rôle `ROLE_APPRENANT`
- ✅ L’utilisateur doit faire partie de la session (`$session->getApprenants()->contains($user)`)
- ⏱ La session doit être active ET en cours (`DateDebut <= now <= DateFin`)
- 🖋 Un utilisateur ne peut signer qu'une seule fois
- 🧾 Les données de la signature (`data:image/png;base64,...`) sont obligatoires

### 📦 Données enregistrées dans `SignatureSession` :
- `user`
- `session`
- `signatureData`
- `heureSignature`
- `statut = 'présent'`

---

## 🌐 Sécurité & Authentification

- Authentification via **JWT** sur les endpoints (`Authorization: Bearer <token>`)
- Récupération du token avec `AsyncStorage` côté mobile
- Accès aux endpoints restreint par annotation `#[IsGranted('ROLE_APPRENANT')]`

---

## 📁 Dossiers / Fichiers impactés

### Mobile (React Native)
- `screens/FeuilleEmargementScreen.tsx`
- `styles/signature.style.ts`

### API Symfony
- `src/Controller/Api/SignatureController.php`
- `src/Entity/SignatureSession.php`
- `src/Entity/Session.php` (ajout méthode `isActive()` si absente)

---

## ✍️ Exemple d’usage

1. L’apprenant clique sur “Signer”
2. Le formulaire de signature s’ouvre (modal avec canvas)
3. Il signe → clic sur “Sauvegarder”
4. L’API Symfony reçoit les données et les enregistre
5. La session est maintenant marquée comme signée

---  

