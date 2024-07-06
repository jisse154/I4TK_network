export const  parseBase64DataURL = (dataURL) => {
    // Vérifier que le format de l'URL est correct
    if (!dataURL.startsWith("data:application/json;base64,")) {
        throw new Error("Invalid data URL format");
    }

    // Extraire la partie base64 de l'URL
    const base64String = dataURL.replace("data:application/json;base64,", "");

    // Décoder la chaîne base64 en JSON
    const jsonString = atob(base64String);

    // Convertir la chaîne JSON en objet JavaScript
    const jsonObject = JSON.parse(jsonString);

    return jsonObject;
}


export const timestampToDateString = (timestamp) => {
   // Créer un objet Date à partir du timestamp
   const date = new Date(timestamp);

   // Noms des mois en anglais
   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

   // Obtenir les différentes parties de la date
   const day = String(date.getDate()).padStart(2, '0');
   const month = monthNames[date.getMonth()];
   const year = date.getFullYear();
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');
   const seconds = String(date.getSeconds()).padStart(2, '0');

   // Construire la chaîne de date
   const dateString = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;

   return dateString;
}


