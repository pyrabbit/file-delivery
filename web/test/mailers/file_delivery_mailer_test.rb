# frozen_string_literal: true

require 'test_helper'

class FileDeliveryMailerTest < ActionMailer::TestCase
  test 'delivers email with file links' do
    email = FileDeliveryMailer.with(
      shop_domain: 'pizzabolt.myshopify.com',
      customer_email: 'customer@example.com',
      active_storage_attachment_ids: [1, 2]
    ).send_files

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['customer@example.com'], email.to
    assert_equal ['noreply@filedispatcher.com'], email.from
  end
end
