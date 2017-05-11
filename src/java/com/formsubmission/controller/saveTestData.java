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
import java.util.LinkedHashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author srv008
 */
public class saveTestData extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    Connection conn = new dbConnection().getConnectionInstance();
    ResultSet rst = null;
    PreparedStatement pstmt = null;
    Map<Integer, Map<String, String>> outermap = new LinkedHashMap<Integer, Map<String, String>>();

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
            String flag = request.getParameter("flag");
            if (flag.equals("S")) {
                String category = request.getParameter("category");
                String score = request.getParameter("score");
                String username = request.getParameter("username");
                String testid = request.getParameter("testid");
                String usermail = request.getParameter("usermail");
                String testDate = request.getParameter("testdate");
                float timeTaken = Float.valueOf(request.getParameter("testTime"));
                System.out.println("time taken value is---" + timeTaken);
                String insertTestData = "insert into usertest_info(USERID,USERNAME,TESTCATEGORY,TESTID,MARKSOBTAINED,TESTDATE,PRINTCERTIFLAG,TIMETAKEN) values(?,?,?,?,?,?,?,?)";
                pstmt = conn.prepareStatement(insertTestData);
                pstmt.setString(1, usermail);
                pstmt.setString(2, username);
                pstmt.setString(3, category);
                pstmt.setString(4, testid);
                pstmt.setString(5, score);
                pstmt.setString(6, testDate);
                pstmt.setString(7, "N");
                pstmt.setFloat(8, timeTaken);
                System.out.println("insertTestData----" + insertTestData);
                pstmt.executeUpdate();

                out.write("success");
            } else if ("F".equals(flag)) {

                String searchValue = request.getParameter("searchValue");
                System.out.println("searchValue-->" + searchValue);
                String fetchData = "select userid,username,testcategory,marksobtained,testdate from usertest_info where testid=?";
                pstmt = conn.prepareStatement(fetchData);
                pstmt.setString(1, searchValue);
                rst = pstmt.executeQuery();
                int i = 1;
                while (rst.next()) {
                    Map<String, String> innermap = new LinkedHashMap<String, String>();
                    innermap.put("email", rst.getString(1));
                    innermap.put("name", rst.getString(2));
                    innermap.put("category", rst.getString(3));
                    innermap.put("totalmarks", rst.getString(4));
                    innermap.put("testdate", rst.getString(5));
                    System.out.println("innermap-->" + innermap);
                    outermap.put(i, innermap);
                    i++;

                }
                System.out.println("outermap-->" + outermap);
                String finalMap = new Gson().toJson(outermap);
                System.out.println("finalMap-->" + finalMap);
                out.write(finalMap);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
//            conn.close();
            outermap.clear();
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
        processRequest(request, response);
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
        processRequest(request, response);
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
