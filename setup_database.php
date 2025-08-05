//setup_database.php<?php
try {
    // Connect to MySQL (without specifying a database)
    $pdo = new PDO("mysql:host=localhost", "root", "daler2003");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected to MySQL successfully<br>";

    // Create the database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS electronic_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database 'electronic_store' created or already exists<br>";

    // Connect to the electronic_store database
    $pdo = new PDO("mysql:host=localhost;dbname=electronic_store", "root", "daler2003");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected to 'electronic_store' database<br>";

    // Read and execute schema.sql
    echo "Importing schema.sql...<br>";
    $schema_sql = file_get_contents("database/schema.sql");
    
    // Split the schema into separate queries
    $schema_queries = explode(';', $schema_sql);
    
    foreach ($schema_queries as $query) {
        if (trim($query) != '') {
            try {
                $pdo->exec($query);
            } catch (PDOException $e) {
                // Skip errors about tables already existing or other benign errors
                if (strpos($e->getMessage(), "already exists") === false) {
                    echo "Error executing schema query: " . $e->getMessage() . "<br>";
                    echo "Query: " . $query . "<br>";
                }
            }
        }
    }
    
    echo "Schema imported successfully<br>";

    // Read and execute init.sql
    echo "Importing init.sql...<br>";
    $init_sql = file_get_contents("database/init.sql");
    
    // Split the init into separate queries
    $init_queries = explode(';', $init_sql);
    
    foreach ($init_queries as $query) {
        if (trim($query) != '') {
            try {
                $pdo->exec($query);
            } catch (PDOException $e) {
                // Skip errors about duplicate entries or other benign errors
                if (strpos($e->getMessage(), "Duplicate entry") === false) {
                    echo "Error executing init query: " . $e->getMessage() . "<br>";
                    echo "Query: " . $query . "<br>";
                }
            }
        }
    }
    
    echo "Data imported successfully<br>";
    
    echo "<strong>Database setup completed!</strong><br>";
    echo "<a href='index.php'>Go to homepage</a>";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "<br>";
}
?> 