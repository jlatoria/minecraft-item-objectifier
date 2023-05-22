
const express = require('express');
var mysql = require("mysql");
const fs = require("fs");

const minecraftData = require('minecraft-data');
const { escape } = require('querystring');
// or for es6: import minecraftData from 'minecraft-data';

const mcData = minecraftData('1.19')
var items = [];

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "minecraft_data"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });



const testItem = {
    id: 0,
    name: 'stone',
    displayName: 'Stone',
    type: 'block',
    category: 'decotration',
    price: 0.50,
    price_sale: 0.25,
    discount: 0,
    volume_sold: 125010,
    volume_24: 150,
    item_data: [],
    ingredients: []


}



var rawItems = [];
var rawBlocks = [];


fs.readFile("./data/items.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      PopulateData();
      
      return;
    }
    items = JSON.parse(jsonString);
    console.log(items.length + " Items Loaded!");
    AddToDatabase();
});


function PopulateData() {
    console.clear();
    var globalId = 0;
    PopulateItems();
    GenerateItems();
    DetermineCraftablity();
    WriteToFile();
}

function GenerateItems() {
    console.log("Generating Items");

    for (let i = 0; i < rawItems.length; i++) {
        const element = rawItems[i];
       
        var item = {
            id: element.id,
            type: 'undefined',
            category: 'undefined',
            name: element.name,
            displayName: element.displayName,
            size: element.stackSize,
            thumbnail_path: "",
            price: 0,
            price_sell: 0,
            discount: 0,
            volume_sold: 0,
            volume_24: 0,
            market_data: [],
            item_data: [],
            craftable: false,
            marketable: true,
            ingredients: [],
            used_in: []
        }

        console.log("adding item: " + item.displayName + "....");
        items.push(item);

    }

    
}


function PopulateItems() {
    console.log("Populating Items...");
    
    var itemCount = mcData.itemsArray.length;
    rawItems = [];
    console.log("Items array reset!");
    for(var i = 0; i < mcData.itemsArray.length; i++) {
        rawItems.push(mcData.items[i]);
    }

    console.log(itemCount + " items loaded!");
}

function PopulateBlocks() {
    console.log("Populating Blocks...");
    
    var blockCount = mcData.blocksArray.length;
    rawBlocks = [];
    console.log("Blocks array reset!");
    for(var i = 0; i < mcData.blocksArray.length; i++) {
        rawItems.push(mcData.blocks[i]);
    }

    console.log(blockCount + " blocks loaded!");
    
}

function WriteToFile() {
    const jsonString = JSON.stringify(items)
    fs.writeFile('./data/items.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}


function DetermineCraftablity() {
    if(items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            var recipe = mcData.recipes[item.id];
            
            if(recipe === undefined) {
                console.log(item.displayName + " is not craftable.");
                items[i].craftable = false;
            } else {
                console.log(item.displayName + " is craftable.");
                items[i].recipe = recipe;
                items[i].craftable = true;
            }
            
        }
    } else {
        PopulateData();
    }
}

function SetCraftablePrice() {

}

function AddToDatabase() {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(item);
        var sql = "INSERT INTO items (id, type, category, name, display_name, stack_size, thumbnail_path, price, price_sell, discount, volume_sold, volume_24, market_data, item_data, craftable, marketable, ingredients, used_in) VALUES ("+ item.id +", '"+ item.type +"', '"+ item.category +"', '"+ item.name +"', '"+ mysql_real_escape_string(item.displayName) +"', "+ item.size +", '"+ item.thumbnail_path +"', "+ item.price +", "+ item.price_sell +", "+ item.discount +", "+ item.volume_sold +", "+ item.volume_24 +", '"+ JSON.stringify(item.market_data) +"', '"+ JSON.stringify(item.item_data) +"', "+ item.craftable +", "+ item.marketable +", '"+ JSON.stringify(item.ingredients) +"', '"+ JSON.stringify(item.used_in) +"')";

        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
        
    }
        
      
}

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
            default:
                return char;
        }
    });
}