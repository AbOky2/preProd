const csv = require('csv-parser');
const fs = require('fs');
// const NodeGeocoder = require('node-geocoder');
const path = require('path');
const { pick } = require('../../helpers/convertAndCheck');
const { propertiesHeader, filteredProperties, tmpImg } = require('../../helpers/property');
const { PropertieModel } = require('../models');
const logger = require('../logs');

// const options = {
//   provider: 'openstreetmap',
// };
// const geocoder = NodeGeocoder(options);

const tmpGetRandomArbitrary = (min, max) => parseInt(Math.random() * (max - min) + min, 10);

// Using callback
const numberTypes = ['price'];
const readMba = () => {
  const datas = [];

  const i = 0;

  fs.createReadStream(path.resolve(__dirname, '../../public/properties/Annonces.csv'), {
    encoding: 'utf-8',
  })
    .pipe(csv())
    .on('data', (data) => datas.push(data))
    .on('end', async () => {
      try {
        const results = datas.map((obj) => {
          const pictures = [];
          const newResult = {};
          const result = Object.keys(obj)
            .reduce((res, v) => res.concat(obj[v]), '')
            .replace(/"/g, '')
            .split('!#');
          // eslint-disable-next-line no-return-assign
          propertiesHeader.map((key, index) => {
            // if (key === 'lot_ref') console.log(result[index], index);
            if (numberTypes.includes(key)) {
              newResult[key] = parseInt(result[index].trim(), 10);
            } else if (key === 'address') {
              const address = result[index].trim();
              newResult[key] = address;
              // if (i < 1) {
              //   i += 1;
              //   try {
              //     console.log(address, i);
              //     const [{ latitude, longitude }] = await geocoder.geocode(address);

              //     newResult.lnt = latitude;
              //     newResult.lat = longitude;
              //     console.log(latitude, longitude);
              //   } catch (error) {
              //     console.log(error);
              //   }
              // }
            } else {
              newResult[key] = result[index].trim();
            }
          });
          // eslint-disable-next-line no-unused-expressions
          // Array.from({ length: 5 }, (_, j) => `picture_${j + 1}`).forEach((e) =>
          //   newResult[e] ? pictures.push(`/properties/${newResult[e]}`) : '',
          // );
          // Array.from({ length: 30 }, (_, j) => `picture_${j + 1}`).forEach((e) =>
          //   newResult[e] ? pictures.push(`/properties/${newResult[e]}`) : '',
          // );
          const data = pick(newResult, filteredProperties);

          const tmpPictures = [1, 2, 3, 4, 5].map(
            (e) => `/properties/${tmpImg[tmpGetRandomArbitrary(0, tmpImg.length - 1)]}`,
          );
          data.pictures = tmpPictures;
          return data;
        });
        // console.log(results.map((e) => e.lot_ref));
        await PropertieModel.create(results);
      } catch (err) {
        if (err.code) {
          logger.info('Updated properties');
        }
      }
    });
};

module.exports = readMba;
// 1 Identifiant agence Texte (16) "monagence" Identifiant agence fourni par nos services
// 2 R??f??rence agence du bien Texte (20) "VE950" Obligatoire R??f??rence de l???annonce
// 3 Type d???annonce Texte (64) "Vente" Obligatoire Choisir entre : cession de bail, location, location vacances, produit d'investissement, vente, vente de prestige, vente fond de commerce, viager
// 4 Type de bien Texte (64) "Maison" Obligatoire Choisir entre : Appartement, b??timent, boutique, bureaux, ch??teau, inconnu, h??tel particulier, immeuble, local, loft/atelier/surface, maison/villa, parking/box, terrain
// 5 CP Texte (5) "06210" Obligatoire Code postal ?? afficher
// 6 Ville Texte (50) "MANDELIEU" Obligatoire Doit correspondre au code postal
// 7 Pays Texte (32) "France"
// 8 Adresse Texte (128) "18 avenue Renoir"
// 9 Quartier / Proximit?? Texte (64) "M??tro r??publique" Voir identification des quartiers
// 10 Activit??s commerciales Texte (128) "BAR, TABAC, PMU"
// 11 Prix / Loyer / Prix de cession D??cimal (11,2) "1250000" Obligatoire Le loyer doit toujours ??tre exprim?? charges comprises
// 12 Loyer / mois murs D??cimal (11,2) "" Dans le cas de Cession de Bail
// 13 Loyer CC Texte (3) "OUI" OUI / NON - loyer charges comprises
// 14 Loyer HT Texte (3) "NON" OUI / NON - loyer hors taxes
// 15 Honoraires D??cimal (11,2) "750" Obligatoire - Ventes : Honoraires TTC ?? la charge de l???acqu??reur en pourcentage du prix du bien hors honoraires Locations : Montant des honoraires en TTC ?? la charge du locataire (en euros)
// 16 Surface (m??) D??cimal (11,2) "130"
// 17 SF terrain (m??) D??cimal (11,2) "2500"
// 18 NB de pi??ces Entier "3" Obligatoire
// 19 NB de chambres Entier "2"
// 20 Libell?? Texte (64) "Maison 3 pi??ces" Obligatoire Libell?? court
// 21 Descriptif Texte (4000) "Tr??s belle maison" Obligatoire Ne pas mettre de caract??res sp??ciaux dans le commentaire.
// 22 Date de disponibilit?? Date "14/04/2003" Format JJ/MM/AAAA
// 23 Charges D??cimal (11,2) "350" En euros Obligatoire (locations) - Montant des charges pour le locataire en euros. Voir champ 304 pour pr??ciser le type de charges
// 24 Etage Entier "0" "0" pour Rez -de -chauss??e / Rez -de -jardin "1" pour le premier ??tage Etc???
// 25 NB d?????tages Entier "2"
// 26 Meubl?? Texte (3) "OUI" OUI / NON
// 27 Ann??e de construction Entier "1985" Champ Num??rique
// 28 Refait ?? neuf Texte (3) "" OUI / NON
// 29 NB de salles de bain Entier "2"
// 30 NB de salles d???eau Entier "2"
// 31 NB de WC Entier "2"
// 32 WC s??par??s Texte (3) "OUI" OUI / NON
// 33 Type de chauffage Entier "512" Voir codifications
// 34 Type de cuisine Entier "3" Voir codifications
// 35 Orientation sud Texte (3) "OUI" OUI / NON
// 36 Orientation est Texte (3) "" OUI / NON
// 37 Orientation ouest Texte (3) "" OUI / NON
// 38 Orientation nord Texte (3) "" OUI / NON
// 39 NB balcons Entier "2"
// 40 SF Balcon D??cimal (11,2) ""
// 41 Ascenseur Texte (3) "NON" OUI / NON
// 42 Cave Texte (3) "OUI" OUI / NON
// 43 NB de parkings Entier ""
// 44 NB de boxes Entier ""
// 45 Digicode Texte (3) "OUI" OUI / NON
// 46 Interphone Texte (3) "NON" OUI / NON
// 47 Gardien Texte (3) "" OUI / NON
// 48 Terrasse Texte (3) "OUI" OUI / NON
// 49 Prix semaine / basse saison D??cimal (11,2) "" Locations vacances uniquement
// 50 Prix quinzaine / basse saison D??cimal (11,2) "" Locations vacances uniquement
// 51 Prix mois / basse saison D??cimal (11,2) "" Locations vacances uniquement
// 52 Prix semaine / haute saison D??cimal (11,2) "" Locations vacances uniquement
// 53 Prix quinzaine / haute saison D??cimal (11,2) "" Locations vacances uniquement
// 54 Prix mois / haute saison D??cimal (11,2) "" Locations vacances uniquement
// 55 NB de personnes Entier "" Locations vacances : Capacit?? d???accueil
// 56 Type de r??sidence Texte (3) "" Location vacances Choisir entre : GIT pour G??te HOT pour Chambre d'h??te
// 57 Situation Texte (32) "mer" Choisir entre : montagne, mer, campagne, ville
// 58 NB de couverts Entier ""
// 59 NB de lits doubles Entier ""
// 60 NB de lits simples Entier ""
// 61 Alarme Texte (3) "OUI" OUI / NON
// 62 C??ble TV Texte (3) "" OUI / NON
// 63 Calme Texte (3) "OUI" OUI / NON
// 64 Climatisation Texte (3) "OUI" OUI / NON
// 65 Piscine Texte (3) "OUI" OUI / NON
// 66 Am??nagement pour Handicap??s Texte (3) "" OUI / NON
// 67 Animaux accept??s Texte (3) "" OUI / NON
// 68 Chemin??e Texte (3) "" OUI / NON
// 69 Cong??lateur Texte (3) "" OUI / NON
// 70 Four Texte (3) "" OUI / NON
// 71 Lave-vaisselle Texte (3) "" OUI / NON
// 72 Micro-ondes Texte (3) "" OUI / NON
// 73 Placards Texte (3) "" OUI / NON
// 74 T??l??phone Texte (3) "" OUI / NON
// 75 Proche lac Texte (3) "" OUI / NON
// 76 Proche tennis Texte (3) "" OUI / NON
// 77 Proche pistes de ski Texte (3) "" OUI / NON
// 78 Vue d??gag??e Texte (3) "OUI" OUI / NON
// 79 Chiffre d???affaire D??cimal (11,2) ""
// 80 Longueur fa??ade (m) D??cimal (11,2) "23" 81 Duplex Texte (3) "" OUI / NON
// 82 Publications Texte (512) "SL,PR,WA" Voir chapitre publications Pour les ventes de prestiges SL (?? diffuser en classique uniquement) BD (?? diffuser en prestige uniquement) Blanc (?? diffuser en classique et en prestige)
// 83 Mandat en exclusivit?? Texte (3) "OUI" OUI / NON
// 84 Coup de c??ur Texte (3) "NON" OUI / NON (utilis?? sur le site de l???agence si celui-ci est D??velopp?? par Seloger.com)
// 85 Photo 1 Texte (4000) "230.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 1 de l???annonce
// 86 Photo 2 Texte (4000) "231.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 2 de l???annonce
// 87 Photo 3 Texte (4000) "232.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 3 de l???annonce
// 88 Photo 4 Texte (4000) "233.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 4 de l???annonce
// 89 Photo 5 Texte (4000) "234.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 5 de l???annonce
// 90 Photo 6 Texte (4000) "235.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 6 de l???annonce
// 91 Photo 7 Texte (4000) "236.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 7 de l???annonce
// 92 Photo 8 Texte (4000) "237.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 8 de l???annonce
// 93 Photo 9 Texte (4000) "238.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 9 de l???annonce
// 94 Titre photo 1 Texte (256) "Entr??e"
// 95 Titre photo 2 Texte (256) "Le s??jour"
// 96 Titre photo 3 Texte (256) "Cuisine"
// 97 Titre photo 4 Texte (256) "La piscine"
// 98 Titre photo 5 Texte (256) ""
// 99 Titre photo 6 Texte (256) ""
// 100 Titre photo 7 Texte (256) ""
// 101 Titre photo 8 Texte (256) ""
// 102 Titre photo 9 Texte (256) ""
// 103 Photo panoramique Texte (128) "" Nom de la photo panoramique (voir le chapitre visite virtuelle)
// 104 URL visite virtuelle Texte (256) "http://www.site.com/visitevi rtu elle?ref=VE950" URL d???une page affichant une visite virtuelle du bien (voir chapitre visites virtuelles)
// 105 T??l??phone ?? afficher Texte (10) "0123456789" Coordonn??es ?? afficher sur l'annonce si diff??rentes
// 106 Contact ?? afficher Texte (64) "Ren?? gossier" des coordonn??es de l???agence
// 107 Email ?? afficher Texte (64) "rgossier@agence.com"
// 108 CP R??el du bien Texte (5) "06210"
// 109 Ville r??elle du bien Texte (50) "MANDELIEU"
// 110 Intercabinet Texte (3) "OUI" Utilis?? dans le cas ou l???agence dispose d???un site g??r?? par Seloger.com avec l???option d???intercabinet
// 111 Intercabinet prive Texte (3) "NON" Autorise ou non l'affichage des informations priv??es aux autres agences ayant acc??s ?? l'inter cabinet. NON : acc??s autorise OUI : acc??s non autoris??
// 112 N?? de mandat Texte (15) "251"
// 113 Date mandat Date "13/02/2003"
// 114 Nom mandataire Texte (64) "DUPONT"
// 115 Pr??nom mandataire Texte (64) "LOUIS"
// 116 Raison sociale mandataire Texte (64)
// 117 Adresse mandataire Texte (128)
// 118 CP mandataire Texte (5)
// 119 Ville mandataire Texte (50)
// 120 T??l??phone mandataire Texte (10) "0123456789"
// 121 Commentaires mandataire Texte (128)
// 122 Commentaires priv??s Texte (128) "Clefs ?? prendre chez legardien"
// 123 Code n??gociateur Texte (50) "MARTIN"
// 124 Code Langue 1 Texte (3)
// 125 Proximit?? Langue 1 Texte (64)
// 126 Libell?? Langue 1 Texte (64)
// 127 Descriptif Langue 1 Texte (4000)
// 128 Code Langue 2 Texte (3)
// 129 Proximit?? Langue 2 Texte (64)
// 130 Libell?? Langue 2 Texte (64)
// 131 Descriptif Langue 2 Texte (4000)
// 132 Code Langue 3 Texte (3)
// 133 Proximit?? Langue 3 Texte (64)
// 134 Libell?? Langue 3 Texte (64)
// 135 Descriptif Langue 3 Texte (4000)
// 136 Champ personnalis?? 1 ??? Dispositif Texte (128)
// 137 Champ personnalis?? 2 ??? Neuf / ancien Texte (128) NEUF / ANCIEN
// 138 Champ personnalis?? 3 ??? Type de sol Texte (128)
// 139 Champ personnalis?? 4 ??? Videophone Texte (128) OUI / NON
// 140 Champ personnalis?? 5 ??? Label BBC Texte (128) OUI / NON
// 141 Champ personnalis?? 6 ??? Date Modification Offre Texte (128)
// 142 Champ personnalis?? 7 ??? Nombre de garage Texte (128)
// 143 Champ personnalis?? 8 ??? Nombre de parking int??rieur Texte (128)
// 144 Champ personnalis?? 9 ??? Nombre de parking ext??rieur Texte (128)
// 145 Champ personnalis?? 10 ??? Etat fa??ade Texte (128)
// 146 Champ personnalis?? 11 ??? Etat partie commune Texte (128)
// 147 Champ personnalis?? 12 ??? R??sidence s??nior Texte (128) OUI / NON
// 148 Champ personnalis?? 13 ??? R??sidence ??tudiante Texte (128) OUI / NON
// 149 Champ personnalis?? 14 ??? Time Share Texte (128) Les produits en time share sont des appartements que tu ach??tes, mais tu n???y passes que quelques semaines par an. OUI / NON
// 150 Champ personnalis?? 15 ??? Programme Solutions Investisseurs Texte (128) Projet 1 ??re mise en loc OUI / NON
// 151 Champ personnalis?? 16 ??? Circuit commercial Texte (128) Premiere location Bien Studea
// 152 Champ personnalis?? 17 ??? Logement ??tudiant Texte (128) OUI / NON
// 153 Champ personnalis?? 18 ??? Exclu Nexity Texte (128) 0 / 1
// 154 Champ personnalis?? 19 ??? collocation interdite Texte (128) 0 = Collocation autoris??e 1 = Collocation interdite
// 155 Champ personnalis?? 20 Texte (128)
// 156 Champ personnalis?? 21 Texte (128)
// 157 Champ personnalis?? 22 Texte (128)
// 158 Champ personnalis?? 23 Texte (128)
// 159 Champ personnalis?? 24 Texte (128)
// 160 Champ personnalis?? 25 Texte (128)
// 161 D??p??t de garantie D??cimal (11 ,2) "700"
// 162 R??cent Texte (3) "OUI" OUI / NON
// 163 Travaux ?? pr??voir Texte (3) "OUI" OUI / NON
// 164 Photo 10 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 10 de l???annonce
// 165 Photo 11 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 11 de l???annonce
// 166 Photo 12 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 12 de l???annonce
// 167 Photo 13 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 13 de l???annonce
// 168 Photo 14 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 14 de l???annonce
// 169 Photo 15 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 15 de l???annonce
// 170 Photo 16 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 16 de l???annonce
// 171 Photo 17 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 17 de l???annonce
// 172 Photo 18 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 18 de l???annonce
// 173 Photo 19 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 19 de l???annonce
// 174 Photo 20 Texte (4000) "Photo.jpg" Nom du fichier ou ?? url ?? d??finissant la photo 20 de l???annonce
// 175 Identifiant technique Texte (30) "00001" Obligatoire Identifiant unique de l???annonce.
// 176 Consommation ??nergie Entier "191" Consommation d?????nergie en kWhEP/m??/an
// 177 Bilan consommation ??nergie Texte (1) "D" Classification de la consommation d?????nergie VI = Vierge ; NS = Non soumis ; A, B, C, D E, ???
// 178 Emissions GES Entier "42" Estimation des ??missions : kg ??qCO2/m??/an
// 179 Bilan ??mission GES Texte (1) "E" Classification des ??missions GES VI = Vierge ; NS = Non soumis ; A, B, C, D E, ???
// 180 Identifiant quartier Entier "" Voir identification des quartiers
// 181 Sous type de bien Texte (32) "Maison de village" Voir liste des sous-types
// 182 P??riodes de disponibilit?? Texte (512) Voir chapitre ???Locations vacances??? Locations vacances uniquement
// 183 P??riodes basse saison Texte (512)
// 184 P??riodes haute saison Texte (512)
// 185 Prix du bouquet D??cimal (11,2) Prix du bouquet (Viager)
// 186 Rente mensuelle D??cimal (11,2) Rente mensuelle (Viager)
// 187 Age de l???homme Entier Age de l???homme (Viager)
// 188 Age de la femme Entier Age de la femme (Viager)
// 189 Entr??e Texte (3) OUI / NON - Le bien dispose d???une entr??e
// 190 R??sidence Texte (3) OUI / NON - (Location vacances uniquement) Le bie n fait partie d???une r??sidence
// 191 Parquet Texte (3) OUI / NON
// 192 Vis - ?? -vis Texte (3) OUI / NON
// 193 Transport : Ligne Texte (5) "8"
// 194 Transport : Station Texte (32) "Opera"
// 195 Dur??e bail Entier Dur??e du bail pour les locations
// 196 Places en salle Entier Nombre de places en salle (pour les restaurants par exemple)
// 197 Monte charge Texte (3) OUI / NON - Le bien dispose d???un monte -charge
// 198 Quai Texte (3) OUI / NON - Pour les boutiques, hangar : Le bien dispose d???un quai.
// 199 Nombre de bureaux Entier
// 200 Prix du droit d???entr??e D??cimal (11,2) Pour les locations
// 201 Prix masqu?? Texte (3) OUI / NON : Uniquement pour belles demeures : affichage d???une tranche de prix (d??termin?? depuis le prix renseign?? dans le champ Prix) plut??t que le pri x
// 202 Loyer annuel global D??cimal (11,2) (Uniquement bureaux, commerces et entreprises)
// 203 Charges annuelles globales D??cimal (11,2) (Uniquement bureaux, commerces et entreprises)
// 204 Loyer annuel au m2 D??cimal (11,2) (Uniquement bureaux, commerces et entreprises)
// 205 Charges annuelles au m2 D??cimal (11,2) (Uniquement bureaux, commerces et entreprises)
// 206 Charges mensuelles HT Texte (3) "NON" (Uniquement bureaux, commerces et entreprises) OUI / NON ??? Charges mensuelles hors taxes
// 207 Loyer annuel CC Texte (3) "OUI" (Uniquement bureaux, commerces et entreprises) OUI / NON - Loyer annuel charges comprises
// 208 Loyer annuel HT Texte (3) "NON" (Uniquement bureaux, commerces et entreprises) OUI / NON - Loyer annuel hors taxes
// 209 Charges annuelles HT Texte (3) "NON" (Uniquement bureaux, commerces et entreprises) OUI / NON - Charges annuelles hors taxes
// 210 Loyer annuel au m2 CC Texte (3) "OUI" (Uniquement bureaux, commerces et entreprises) OUI / NON - Loyer annuel au m2 charges comprises
// 211 Loyer annuel au m2 HT Texte (3) "NON" (Uniquement bureaux, commerces et entreprises) OUI / NON - Loyer annuel au m2 hors taxes
// 212 Charges annuelles au m2 HT Texte (3) "NON" (Uniquement bureaux, commerces et entreprises) OUI / NON - Charges annuelles au m2 hors taxes
// 213 Divisible Texte (3) "OUI" (Uniquement bureaux, commerces et entreprises) OUI / NON - La surface est divisible
// 214 Surface divisible minimale D??cimal (11,2) (Uniquement bureaux, commerces et entreprises)
// 215 Surface divisible maximale D??cimal (11,2) (Uniquement bureaux, commerces et entreprises)
// 216 Surface s??jour D??cimal (11,2) Surface du s??jour
// 217 Nombre de v??hicules Entier "2" (Uniquement parkings)
// 218 Prix du droit au bail D??cimal (11,2) "250" (Uniquement locations)
// 219 Valeur ?? l???achat D??cimal (11,2) "150000" (Uniquement produits d???investissement)
// 220 R??partition du chiffre d???affaire Texte (100) "70 % bar / 30 % restaurant" (Uniquement Ventes fond de commerce)
// 221 Terrain agricole Texte (3) "OUI" OUI/NON
// 222 Equipement b??b?? Texte (3) "OUI" OUI/NON
// 223 Terrain constructible Texte (3) "OUI" OUI/NON
// 224 R??sultat Ann??e N-2 Entier "65000" R??sultats ann??e N-2 (Uniquement Ventes fond de commerce)
// 225 R??sultat Ann??e N-1 D??cimal(11,2) "55000" R??sultats ann??e N-1 (Uniquement Ventes fond de commerce)
// 226 R??sultat Actuel Entier "60000" R??sultats ann??e en cours (Uniquement Ventes fond de commerce)
// 227 Immeuble de parkings Texte (3) "OUI" OUI/NON (Uniquement pour les parkings)
// 228 Parking isol?? Texte (3) "OUI" OUI/NON (Uniquement pour les parkings)
// 229 Si Viager Vendu Libre Texte (3) "OUI" OUI/NON
// 230 Logement ?? disposition Texte (3) "OUI" OUI/NON Le commerce dispose d???un logement
// 231 Terrain en pente Texte (3) "OUI" OUI/NON (Uniquement pour les terrains)
// 232 Plan d???eau Texte (3) "OUI" OUI/NON : Le bien dispose d???un plan d???eau (Uniquement pour les terrains et/ou les ch??teaux)
// 233 Lave linge Texte (3) "OUI" OUI/NON
// 234 S??che linge Texte (3) "OUI" OUI/NON
// 235 Connexion internet Texte (3) "OUI" OUI/NON
// 236 Chiffre affaire Ann??e N-2 Entier "35000" Chiffre d???affaire ann??e N-2
// 237 Chiffre affaire Ann??e N-1 Entier "45000" Chiffre d???affaire ann??e N-1
// 238 Conditions financi??res Texte (128) "Frais de r??daction d'acte : 4,5% du loyer annuel HT/HC" (Uniquement pour les bureaux)
// 239 Prestations diverses Texte (128) "Interphone - Digicode" (Uniquement pour les bureaux)
// 240 Longueur fa??ade D??cimal (11,2) "4,5" (Uniquement pour les boutiques ou terrains)
// 241 Montant du rapport Texte (20) "650" (Uniquement pour les produits d???investissement)
// 242 Nature du bail Texte (50) "Location meubl??e" (Uniquement pour les locations)
// 243 Nature bail commercial Texte (50) "Tous commerces sauf restauration" (Uniquement pour les ventes fond de commerce)
// 244 Nombre terrasses Entier "3"
// 245 Prix hors taxes Texte (3) "OUI" OUI/NON
// 246 Si Salle ?? manger Texte (3) "OUI" OUI/NON
// 247 Si S??jour Texte (3) "OUI" OUI/NON
// 248 Terrain donne sur la rue Texte (3) "OUI" OUI/NON
// 249 Immeuble de type bureaux Texte (3) "OUI" OUI/NON
// 250 Terrain viabilis?? Texte (3) "OUI" OUI/NON
// 251 Equipement Vid??o Texte (3) "OUI" OUI/NON
// 252 Surface de la cave D??cimal (11,2) "10"
// 253 Surface de la salle ?? manger D??cimal (11,2) "40"
// 254 Situation commerciale Texte (64) "Rue pi??tonne proche du march??" (Uniquement pour les boutiques)
// 255 Surface maximale d???un bureau D??cimal (11,2) "25" (Uniquement pour les bureaux)
// 256 Honoraires charge acqu??reur (obsol??te) Texte (3) "OUI" Evolution 15/03/2017 Remplac?? par le champ 302
// 257 Pourcentage honoraires TTC (obsol??te) D??cimal(11,2) 3 Evolution 15/03/2017 Remplac?? par le champ 15
// 258 En copropri??t?? Texte (3) "OUI" Evolution 09/07/2014 OUI/NON (ALUR) Le bien est-il dans une copropri??t??
// 259 Nombre de lots Entier 10 Evolution 09/07/2014 Nombre de lots dans la copropri??t?? (ALUR)
// 260 Charges annuelles D??cimal(11,2) 3500 Evolution 09/07/2014 Montant moyen annuel de la quote-part du budget pr??visionnel des d??penses courantes (ALUR)
// 261 Syndicat des copropri??taires en proc??dure Texte (3) "OUI" Evolution 09/07/2014 OUI/NON (ALUR) Le syndicat des copropri??taires fait-il l???objet d???une proc??dure ?
// 262 D??tail proc??dure du syndicat des copropri??taires Texte (128) Evolution 09/07/2014 D??tails sur la proc??dure en cours du syndicat des copropri??taires
// 263 Champ personnalis?? 26 Texte (128) ""
// 264 Photo 21 Texte (256) "Photo.jpg" ou "http://..."
// 265 Photo 22 Texte (256) "Photo.jpg" ou "http://..."
// 266 Photo 23 Texte (256) "Photo.jpg" ou "http://..."
// 267 Photo 24 Texte (256) "Photo.jpg" ou "http://..."
// 268 Photo 25 Texte (256) "Photo.jpg" ou "http://..."
// 269 Photo 26 Texte (256) "Photo.jpg" ou "http://..."
// 270 Photo 27 Texte (256) "Photo.jpg" ou "http://..."
// 271 Photo 28 Texte (256) "Photo.jpg" ou "http://..."
// 272 Photo 29 Texte (256) "Photo.jpg" ou "http://..."
// 273 Photo 30 Texte (256) "Photo.jpg" ou "http://..."
// 274 Titre photo 10 Texte (256) ""
// 275 Titre photo 11 Texte (256) ""
// 276 Titre photo 12 Texte (256) ""
// 277 Titre photo 13 Texte (256) ""
// 278 Titre photo 14 Texte (256) ""
// 279 Titre photo 15 Texte (256) ""
// 280 Titre photo 16 Texte (256) ""
// 281 Titre photo 17 Texte (256) ""
// 282 Titre photo 18 Texte (256) ""
// 283 Titre photo 19 Texte (256) ""
// 284 Titre photo 20 Texte (256) ""
// 285 Titre photo 21 Texte (256) ""
// 286 Titre photo 22 Texte (256) ""
// 287 Titre photo 23 Texte (256) ""
// 288 Titre photo 24 Texte (256) ""
// 289 Titre photo 25 Texte (256) ""
// 290 Titre photo 26 Texte (256) ""
// 291 Titre photo 27 Texte (256) ""
// 292 Titre photo 28 Texte (256) ""
// 293 Titre photo 29 Texte (256) ""
// 294 Titre photo 30 Texte (256) ""
// 295 Prix Terrain D??cimal (20,0) "85000" Construire : Dans le cas d'une vente de "maison + terrain"->prix du terrain seul
// 296 Prix du mod??le de Maison D??cimal (20,0) "140000" Construire : Dans le cas d'une vente de "maison + terrain" -> Prix de la maison seule
// 297 Nom de l'agence g??rant le terrain Texte (256) "Agence terra nova" Construire : Dans le cas d'une vente de "maison + terrain" -> Nom de l'agence g??rant la vente du terrain
// 298 Latitude D??cimal (5,5) "48.87079" Latitude et longitude du bien (exemple correspondant au 55 rue Faubourg Saint Honor??, 75008 Paris)
// 299 Longitude D??cimal (5,5) "2.31689" Latitude et longitude du bien (exemple correspondant au 55 rue Faubourg Saint Honor??, 75008 Paris)
// 300 Pr??cision GPS Entier "1" Obligatoire pour la prise en compte des coordonn??es Degr?? de pr??cision des coordonn??es GPS (Cf section Pr??cision GPS)
// 301 Version Format Texte (10) "4.08-006" Obligatoire Version du format envoy?? (Version-R??vision)
// 302 Honoraires ?? la charge De Entier "1" - Acqu??reur "2" - Vendeur "3" - Acqu??reur ET Vendeur (Loi Alur 02/2017) Obligatoire VENTE UNIQUEMENT Sp??cifie la(les) personne(s) en charge du r??glement des honoraires ?? l???issue de la transaction
// 303 Prix hors honoraires acqu??reur D??cimal (20,0) "1200000" (Loi Alur 02/2017) Obligatoire VENTE UNIQUEMENT Prix du bien hors honoraires acqu??reur
// 304 Modalit??s charges Locataire Entier "1" - Forfaitaires mensuelles "2" - Pr??visionnelles mensuelles avec r??gularisation annuelle "3"
// 305 Compl??ment loyer D??cimal (11,2)
// 306 Part honoraires
