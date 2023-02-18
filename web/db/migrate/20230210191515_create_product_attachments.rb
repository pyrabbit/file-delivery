class CreateProductAttachments < ActiveRecord::Migration[7.0]
  def change
    create_table :product_attachments do |t|
      t.references :shop, null: false, foreign_key: true
      t.references :active_storage_attachment, null: false
      t.string :product_id, null: false

      t.timestamps
    end

    add_foreign_key :product_attachments, :active_storage_attachments, on_delete: :cascade
  end
end
