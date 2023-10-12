<?php
$host = "localhost";  // L'hôte de la base de données
$username = "root";  // Le nom d'utilisateur de la base de données
$password = "";  // Le mot de passe de la base de données
$database = "jobboard";  // Le nom de la base de données

// Établissez la connexion à la base de données
$db_connection = mysqli_connect($host, $username, $password, $database);

// Vérifiez si la connexion a réussi
if (!$db_connection) {
    die("La connexion à la base de données a échoué : " . mysqli_connect_error());
}

// Requete d'annonces
$query = "SELECT * FROM job_advertisements";
$result = mysqli_query($db_connection, $query);

$advertisements = array();
while ($row = mysqli_fetch_assoc($result)) {
    $advertisements[] = $row;
}

// Fermez la connexion à la base de données
mysqli_close($db_connection);
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    <title>Search</title>
</head>
<body>
    <header id="header">
    </header>
    <hr>
    <main>
        <form action="#" class="search-bar">
            <input type="text" name="search" id="search" placeholder="Rechercher le post">
            <input type="text" name="search2" id="search" placeholder="Lieux">
            <button class="btn">search</button>
        </form>
        <div id="fade"></div>
        <div id="job-board">
            <?php
            foreach ($advertisements as $advertisement) {
                echo '<div class="job">';
                echo '<p>Titre : ' . $advertisement['title'] . '</p>';
                echo '<p>Description : ' . $advertisement['description'] . '</p>';
              
                // Ajoutez d'autres éléments HTML pour afficher les informations de l'annonce
                echo '</div>';
            }
            ?>  
        </div>
    </main>
    <hr>
    <footer id="footer">
    </footer>
    <script src="js/loader.js"></script>
    <script src="js/show_search.js"></script>
</body>
</html>