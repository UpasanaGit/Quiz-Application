/*
 * DB Connection class
 * 
 */
package com.formsubmission.controller;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class dbConnection {

    public Connection getConnectionInstance() {
        Connection conn = null;
        Properties prop;
        try {
            InputStream inputStream = new FileInputStream("/home/srv008/Oracle/Middleware/Oracle_Home/user_projects/domains/srv7031/SRVConfig/DatabaseDetails.properties");

            prop = new Properties();
            prop.load(inputStream);

            Class.forName(prop.getProperty("driver"));
            conn = DriverManager.getConnection(
                    prop.getProperty("url"), prop.getProperty("username"), prop.getProperty("password"));

        } catch (ClassNotFoundException ex) {
            System.out.println("class not found : " + ex.getMessage());
            ex.printStackTrace();
        } catch (SQLException ex) {
            System.out.println("database exception : " + ex.getMessage());
            ex.printStackTrace();
        } catch (FileNotFoundException ex) {
            System.out.println("File not found exception : " + ex.getMessage());
            ex.printStackTrace();
        } catch (Exception ex) {
            System.out.println("exception : " + ex.getMessage());
            ex.printStackTrace();
        }
        return conn;
    }
}
