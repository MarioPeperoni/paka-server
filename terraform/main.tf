terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "resource-group" {
  name     = "paka-app"
  location = "polandcentral"
}

resource "azurerm_storage_account" "storage-account" {
  name                     = "pakaappstorage"
  resource_group_name      = azurerm_resource_group.resource-group.name
  location                 = azurerm_resource_group.resource-group.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "storage-container" {
  name                  = "delivery-images"
  storage_account_name  = azurerm_storage_account.storage-account.name
  container_access_type = "blob"
}

resource "azurerm_mssql_server" "mssql-server" {
  name                         = "pakaappsqlserver"
  resource_group_name          = azurerm_resource_group.resource-group.name
  location                     = azurerm_resource_group.resource-group.location
  version                      = "12.0"
  administrator_login          = "pakaadmin"
  administrator_login_password = "Osiem888"
}

resource "azurerm_mssql_database" "mssql-database" {
  server_id            = azurerm_mssql_server.mssql-server.id
  name                 = "pakaappdb"
  sku_name             = "GP_S_Gen5_1"
  storage_account_type = "Local"
  zone_redundant       = false

  auto_pause_delay_in_minutes = -1
  min_capacity                = 0.5
}

resource "azurerm_mssql_firewall_rule" "allow_all_ips" {
  name             = "AllowAllIps"
  server_id        = azurerm_mssql_server.mssql-server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

output "sql_connection_string" {
  value     = "sqlserver://${azurerm_mssql_server.mssql-server.fully_qualified_domain_name};database=${azurerm_mssql_database.mssql-database.name};user=${azurerm_mssql_server.mssql-server.administrator_login};password=${azurerm_mssql_server.mssql-server.administrator_login_password};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;"
  sensitive = true
}

output "blob_storage_connection_string" {
  value     = azurerm_storage_account.storage-account.primary_connection_string
  sensitive = true
}
