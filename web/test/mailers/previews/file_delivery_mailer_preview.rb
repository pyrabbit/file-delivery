# Preview all emails at http://localhost:3000/rails/mailers/file_delivery_mailer
class FileDeliveryMailerPreview < ActionMailer::Preview
  def send_files
    FileDeliveryMailer.with(
      shop_domain: 'pizzabolt.myshopify.com',
      customer_email: 'customer@example.com',
      active_storage_attachment_ids: [1, 2]
    ).send_files
  end
end
