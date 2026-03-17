"""
Email Service - SMTP Integration for EV Charging Station

This module handles all email notifications including:
- Booking confirmations
- Booking reminders
- Status updates
- Password resets
- Admin alerts
"""

import smtplib
import logging
from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from app.config import settings

logger = logging.getLogger(__name__)


class EmailService(ABC):
    """Abstract base class for email services"""
    
    @abstractmethod
    async def send_email(
        self,
        to: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None
    ) -> bool:
        """Send an email"""
        pass
    
    @abstractmethod
    async def send_bulk_email(
        self,
        recipients: List[str],
        subject: str,
        html_body: str,
        text_body: Optional[str] = None
    ) -> int:
        """Send email to multiple recipients"""
        pass


class SMTPEmailService(EmailService):
    """SMTP-based email service (Gmail, SendGrid, etc.)"""
    
    def __init__(
        self,
        smtp_server: str = settings.SMTP_SERVER,
        smtp_port: int = settings.SMTP_PORT,
        username: str = settings.SMTP_USER,
        password: str = settings.SMTP_PASSWORD,
        from_email: str = settings.SMTP_USER
    ):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.username = username
        self.password = password
        self.from_email = from_email
    
    async def send_email(
        self,
        to: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None
    ) -> bool:
        """
        Send an email via SMTP
        
        Args:
            to: Recipient email address
            subject: Email subject
            html_body: HTML email body
            text_body: Plain text email body (fallback)
        
        Returns:
            True if successful, False otherwise
        """
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.from_email
            message["To"] = to
            
            # Add plain text and HTML parts
            if text_body:
                message.attach(MIMEText(text_body, "plain"))
            message.attach(MIMEText(html_body, "html"))
            
            # Send via SMTP
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.sendmail(self.from_email, to, message.as_string())
            
            logger.info(f"Email sent to {to}: {subject}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to}: {str(e)}")
            return False
    
    async def send_bulk_email(
        self,
        recipients: List[str],
        subject: str,
        html_body: str,
        text_body: Optional[str] = None
    ) -> int:
        """
        Send email to multiple recipients
        
        Args:
            recipients: List of recipient email addresses
            subject: Email subject
            html_body: HTML email body
            text_body: Plain text email body
        
        Returns:
            Number of emails successfully sent
        """
        success_count = 0
        
        for recipient in recipients:
            if await self.send_email(recipient, subject, html_body, text_body):
                success_count += 1
        
        return success_count


class EmailTemplates:
    """Email template generators"""
    
    @staticmethod
    def booking_confirmation(
        user_name: str,
        station_name: str,
        booking_id: str,
        start_time: str,
        end_time: str,
        total_price: float,
        confirmation_link: str
    ) -> tuple:
        """Generate booking confirmation email"""
        
        subject = f"Booking Confirmed - Reference #{booking_id}"
        
        html_body = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); color: white; padding: 20px; text-align: center; border-radius: 5px; }}
                    .content {{ background: #f8f9fa; padding: 20px; margin-top: 10px; border-radius: 5px; }}
                    .detail {{ margin: 10px 0; }}
                    .label {{ font-weight: bold; color: #0ea5e9; }}
                    .button {{ background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }}
                    .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 20px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Booking Confirmed! ⚡</h1>
                    </div>
                    
                    <div class="content">
                        <p>Hi {user_name},</p>
                        
                        <p>Thank you for booking with EV Charge! Your booking has been confirmed.</p>
                        
                        <div class="detail">
                            <span class="label">Booking Reference:</span> {booking_id}
                        </div>
                        
                        <div class="detail">
                            <span class="label">Station:</span> {station_name}
                        </div>
                        
                        <div class="detail">
                            <span class="label">Start Time:</span> {start_time}
                        </div>
                        
                        <div class="detail">
                            <span class="label">End Time:</span> {end_time}
                        </div>
                        
                        <div class="detail">
                            <span class="label">Total Cost:</span> ${total_price:.2f}
                        </div>
                        
                        <a href="{confirmation_link}" class="button">View Booking Details</a>
                        
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">
                            Please arrive at the station 5 minutes before your scheduled time. 
                            If you need to cancel or modify your booking, please visit your dashboard.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p>© 2026 EV Charge. All rights reserved.</p>
                        <p>Questions? Contact support@evcharge.app</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        text_body = f"""
        Booking Confirmed - Reference #{booking_id}
        
        Hi {user_name},
        
        Your booking has been confirmed!
        
        Station: {station_name}
        Start: {start_time}
        End: {end_time}
        Total: ${total_price:.2f}
        
        View details: {confirmation_link}
        
        © 2026 EV Charge
        """
        
        return subject, html_body, text_body
    
    @staticmethod
    def booking_reminder(
        user_name: str,
        station_name: str,
        start_time: str,
        booking_link: str
    ) -> tuple:
        """Generate booking reminder email"""
        
        subject = f"Reminder: Your EV Charging Session Starts Soon ⚡"
        
        html_body = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .alert {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; }}
                    .content {{ background: #f8f9fa; padding: 20px; margin-top: 10px; border-radius: 5px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="alert">
                        <h2 style="margin-top: 0; color: #856404;">Charging Session Reminder</h2>
                        <p>Your charging session at <strong>{station_name}</strong> starts at <strong>{start_time}</strong>.</p>
                        <p>Please arrive 5 minutes early!</p>
                    </div>
                    
                    <div class="content">
                        <p>Hi {user_name},</p>
                        <p>This is a friendly reminder about your upcoming EV charging session.</p>
                        <p><a href="{booking_link}" style="color: #0ea5e9;">View your booking</a></p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        text_body = f"""
        Charging Session Reminder
        
        Your session at {station_name} starts at {start_time}.
        Please arrive 5 minutes early.
        
        View booking: {booking_link}
        """
        
        return subject, html_body, text_body
    
    @staticmethod
    def password_reset(user_name: str, reset_link: str) -> tuple:
        """Generate password reset email"""
        
        subject = "Reset Your EV Charge Password"
        
        html_body = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .button {{ background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Hi {user_name},</p>
                    
                    <p>We received a request to reset your password. Click the button below to proceed:</p>
                    
                    <p><a href="{reset_link}" class="button">Reset Password</a></p>
                    
                    <p style="color: #999; font-size: 12px;">This link expires in 24 hours. If you didn't request this, ignore this email.</p>
                </div>
            </body>
        </html>
        """
        
        text_body = f"""
        Reset Your Password
        
        Hi {user_name},
        
        Click here to reset your password: {reset_link}
        
        This link expires in 24 hours.
        """
        
        return subject, html_body, text_body
    
    @staticmethod
    def daily_availability_alert(
        user_name: str,
        stations_available: List[Dict]
    ) -> tuple:
        """Generate daily availability alert"""
        
        subject = "⚡ Available EV Charging Stations Near You"
        
        stations_html = ""
        for station in stations_available[:5]:  # Top 5
            stations_html += f"""
            <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 5px;">
                <strong>{station['name']}</strong> - {station['distance']:.1f} km away<br>
                Available: {station['available']}/{station['total']} slots<br>
                Price: ${station['price']}/kWh
            </div>
            """
        
        html_body = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Good News, {user_name}! ⚡</h2>
                    <p>There are available EV charging stations near your favorites today:</p>
                    
                    {stations_html}
                    
                    <p><a href="https://evcharge.app/stations" style="color: #0ea5e9; font-weight: bold;">Start Charging Now →</a></p>
                </div>
            </body>
        </html>
        """
        
        text_body = f"Available Charging Stations\n\nHi {user_name},\n\nThere are charging stations available near your favorites today. Check them out at: https://evcharge.app/stations"
        
        return subject, html_body, text_body
    
    @staticmethod
    def booking_cancellation(
        user_name: str,
        station_name: str,
        booking_id: str,
        refund_amount: float
    ) -> tuple:
        """Generate booking cancellation email"""
        
        subject = f"Booking Cancelled - Reference #{booking_id}"
        
        html_body = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: #fee2e2; color: #991b1b; padding: 20px; text-align: center; border-radius: 5px; }}
                    .content {{ background: #f8f9fa; padding: 20px; margin-top: 10px; border-radius: 5px; }}
                    .detail {{ margin: 10px 0; }}
                    .label {{ font-weight: bold; color: #0ea5e9; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Booking Cancelled</h1>
                    </div>
                    
                    <div class="content">
                        <p>Hi {user_name},</p>
                        
                        <p>Your booking has been successfully cancelled.</p>
                        
                        <div class="detail">
                            <span class="label">Booking Reference:</span> {booking_id}
                        </div>
                        
                        <div class="detail">
                            <span class="label">Station:</span> {station_name}
                        </div>
                        
                        <div class="detail">
                            <span class="label">Refund Amount:</span> ${refund_amount:.2f}
                        </div>
                        
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">
                            The refund will be processed to your original payment method within 1-2 business days.
                        </p>
                        
                        <p>If you have any questions, please contact support@evcharge.app</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        text_body = f"""
        Booking Cancelled - Reference #{booking_id}
        
        Hi {user_name},
        
        Your booking has been cancelled.
        
        Station: {station_name}
        Reference: {booking_id}
        Refund: ${refund_amount:.2f}
        
        Refund will be processed within 1-2 business days.
        
        Questions? Contact support@evcharge.app
        """
        
        return subject, html_body, text_body


class EmailNotificationService:
    """High-level email notification service"""
    
    def __init__(self, email_service: EmailService = None):
        self.email_service = email_service or SMTPEmailService()
    
    async def send_booking_confirmation(
        self,
        to: str,
        user_name: str,
        station_name: str,
        booking_id: str,
        start_time: str,
        end_time: str,
        total_price: float,
        confirmation_link: str
    ) -> bool:
        """Send booking confirmation email"""
        subject, html, text = EmailTemplates.booking_confirmation(
            user_name, station_name, booking_id, start_time, end_time, total_price, confirmation_link
        )
        return await self.email_service.send_email(to, subject, html, text)
    
    async def send_booking_reminder(
        self,
        to: str,
        user_name: str,
        station_name: str,
        start_time: str,
        booking_link: str
    ) -> bool:
        """Send booking reminder email"""
        subject, html, text = EmailTemplates.booking_reminder(user_name, station_name, start_time, booking_link)
        return await self.email_service.send_email(to, subject, html, text)
    
    async def send_password_reset(
        self,
        to: str,
        user_name: str,
        reset_link: str
    ) -> bool:
        """Send password reset email"""
        subject, html, text = EmailTemplates.password_reset(user_name, reset_link)
        return await self.email_service.send_email(to, subject, html, text)
    
    async def send_daily_availability_alert(
        self,
        to: str,
        user_name: str,
        stations: List[Dict]
    ) -> bool:
        """Send daily availability alert"""
        subject, html, text = EmailTemplates.daily_availability_alert(user_name, stations)
        return await self.email_service.send_email(to, subject, html, text)
    
    async def send_booking_cancellation(
        self,
        to: str,
        user_name: str,
        station_name: str,
        booking_id: str,
        refund_amount: float
    ) -> bool:
        """Send booking cancellation email"""
        subject, html, text = EmailTemplates.booking_cancellation(user_name, station_name, booking_id, refund_amount)
        return await self.email_service.send_email(to, subject, html, text)


# Global instance
email_service = EmailNotificationService()


# Usage Example:
# await email_service.send_booking_confirmation(
#     to="user@example.com",
#     user_name="John Doe",
#     station_name="Downtown Station",
#     booking_id="BK123456",
#     start_time="2:00 PM",
#     end_time="3:00 PM",
#     total_price=12.50,
#     confirmation_link="https://evcharge.app/bookings/BK123456"
# )
