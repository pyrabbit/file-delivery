# frozen_string_literal: true

class FileDeliveryMailer < ApplicationMailer
  default from: 'noreply@filedispatcher.com',
          subject: 'Your files are now ready to be downloaded.'

  def send_files
    @shop_domain = params[:shop_domain]
    mail(to: params[:customer_email])
  end
end
