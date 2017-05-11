/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.formsubmission.controller;

/**
 *
 * @author srv
 */
import java.util.ArrayList;
import java.util.Properties;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;

import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class SendAttachmentInMail {

    public static void sendMail(String receiver) {
        // Recipient's email ID needs to be mentioned.
//        String to = "shivani.aggarwal@servosys.com";

        // Sender's email ID needs to be mentioned
        System.out.println("into sendMail");
        String from = "deepanshu.mehandiratta23@gmail.com";

        final String username = "deepanshu.mehandiratta23@gmail.com";//change accordingly
        final String password = "chamasari6628";
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "465");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        // Get the Session object.
        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });

        try {
            // Create a default MimeMessage object.
            Message message = new MimeMessage(session);

            // Set From: header field of the header.
            message.setFrom(new InternetAddress(from));

            // Set To: header field of the header.
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(receiver));

            // Set Subject: header field
            message.setSubject("Testing Subject");

            // Create the message part
            BodyPart messageBodyPart = new MimeBodyPart();

            // Now set the actual message
            messageBodyPart.setText("thanks for signing up in my website, click below link to login");

             //Create a multipart message
            Multipart multipart = new MimeMultipart();

            // Set text message part
            multipart.addBodyPart(messageBodyPart);

             //Part two is attachment
            messageBodyPart = new MimeBodyPart();
            ArrayList<String> filenames = new ArrayList<String>();
            filenames.add("/home/srv/Desktop/metar.html");
            filenames.add("/home/srv/Desktop/DatabaseDetails.properties");
            for (int i = 0; i < filenames.size(); i++) {
                DataSource source = new FileDataSource(filenames.get(i));

                messageBodyPart.setDataHandler(new DataHandler(source));
                messageBodyPart.setFileName(filenames.get(i));
                multipart.addBodyPart(messageBodyPart);
                message.setContent(multipart);
            }
            // Send the complete message parts
            // Send message
            Transport.send(message);

            System.out.println("Sent message successfully....");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } finally {
            session = null;

        }
    }
}
