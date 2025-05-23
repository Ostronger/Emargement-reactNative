# Issues techniques rencontrées – Projet Mobile Émargement (Expo + React Native)

Ce fichier regroupe les erreurs et conflits rencontrés lors de la mise en place des tests et des dépendances dans l’application mobile, ainsi que les solutions appliquées pour chacun.

---

##  erreurs et solutions

Erreur rencontrée   

1-`Module not found: @testing-library/react-native`
2-`ERESOLVE unable to resolve dependency tree`
3-`No matching version found for jest-expo@49.0.2` 
4-`Incorrect version of "react-test-renderer"` (attendu 19.0.0, trouvé 18.3.1) 
5-`Conflicting peer dependency: @types/react@18.x vs @types/react@19.x`  
6-`Object.defineProperty called on non-object` (venant de `jest-expo/src/preset/setup.js`) 

Cause 

1-La bibliothèque de test n'était pas installée
2-Conflit entre les versions de React, react Native, et les peer dependancies
3-La version `jest-expo@49.0.2` n'existe pas 
4-`@testing-library/react-native` attend `react-test-renderer@19.0.0` quand on utilise React 19
5-`react-native@0.79.2` attend `@types/react@^19.0.0` mais le projet avait `@types/react@18.x`
6-Mauvaise version de `jest-expo` utilisée avec React 19

Solution appliquée  

1-`npm install --save-dev @testing-library/react-native` 
2-Ajouter `--legacy-peer-deps` lors de l'installation : `npm install ... --legacy-peer-deps`
3-Installer `jest-expo@^53.0.0` (compatible avec Expo SDK 53)  
4-`npm install --save-dev react-test-renderer@19.0.0 --legacy-peer-deps`
5-`npm uninstall @types/react && npm install --save-dev @types/react@19`
6-Installer `jest-expo@^53.0.0` avec `--legacy-peer-deps`

---
## Contexte technique

- **Expo SDK :** 53.0.0
- **React :** 19.0.0
- **React Native :** 0.79.2
- **TypeScript :** utilisé
- **Environnement de test :** Jest + @testing-library/react-native

##  Auteur