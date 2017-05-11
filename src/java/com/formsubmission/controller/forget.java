/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.formsubmission.controller;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author srv
 */
public class forget extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    Connection conn = null;
    PreparedStatement pstmt = null;
    ResultSet rst = null;
    List<String> securityData = new ArrayList<String>();

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
            conn = new dbConnection().getConnectionInstance();
            System.out.println("conn" + conn);
            String flag = request.getParameter("flag");
            String email = request.getParameter("email");
            System.out.println("");
            if (flag.equals("F")) {

                String checkMailValid = "select securityquestion,securityanswer from userdata_test where usermail=?";
                pstmt = conn.prepareStatement(checkMailValid);
                pstmt.setString(1, email);
                System.out.println("checkMailValid" + checkMailValid);
                rst = pstmt.executeQuery();

                if (rst.next()) {
                    System.out.println("into rst if");
                    securityData.add(rst.getString(1));
                    securityData.add(rst.getString(2));
                } else {

                }
                out.write(new Gson().toJson(securityData));
            } else {
                System.out.println("into R flag");
                String password = request.getParameter("password");
                System.out.println("password-->" + password);
                System.out.println("email-->" + email);
                System.out.println("flag-->" + flag);
                String updatePassword = "update userdata_test set userpassword=? where usermail=?";
                pstmt = conn.prepareStatement(updatePassword);
                pstmt.setString(1, password);
                pstmt.setString(2, email);
                System.out.println("updatepassword--->" + updatePassword);
                pstmt.executeQuery();

                out.write("");

            }
        } catch (Exception e) {

        } finally {
            conn.close();
            securityData.clear();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(forget.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(forget.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
