class ShopOrder < ApplicationRecord
  has_secure_token
  belongs_to :shop
  validates :order_id, presence: true, uniqueness: true
end
