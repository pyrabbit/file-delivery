class CreateShopOrders < ActiveRecord::Migration[7.0]
  def change
    create_table :shop_orders do |t|
      t.references :shop, null: false, foreign_key: true
      t.integer :order_id, null: false
      t.string :token, null: false

      t.timestamps
    end
  end
end
