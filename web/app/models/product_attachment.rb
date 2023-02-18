class ProductAttachment < ApplicationRecord
  belongs_to :shop
  belongs_to :active_storage_attachment, class_name: 'ActiveStorage::Attachment'

  validates :product_id, presence: true, uniqueness: { scope: [:shop_id, :active_storage_attachment_id] }
end
