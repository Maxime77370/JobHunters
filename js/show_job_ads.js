function checkUserRole() {
    if (!token) {
        console.error("Aucun token trouvé.")
        window.location.href = "home.html";
        return;
    }

try {
    const user = JSON.parse(atob(token.split(".")[1]));
    if (user && (user.role === "entreprise" || user.role === "admin")) {
        console.log("L'utilisateur est un entrepreneur.");
    } else {
        console.log("L'utilisateur n'est pas un entrepreneur.");
        window.location.href = "home.html";
    }
} catch (error) {
    console.error("Erreur du décodage du token:", error);
    console.log("Une erreur s'est produite lors de la vérification du rôle de l'utilisateur.");
}
}

checkUserRole();