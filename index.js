
const express = require('express');
var mysql = require("mysql");

const minecraftData = require('minecraft-data')
// or for es6: import minecraftData from 'minecraft-data';

const mcData = minecraftData('1.19')

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

PopulateData();
console.log(mcData.items[772]) 
function PopulateData() {
    console.clear();
    var globalId = 0;
    PopulateItems();
    


    
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
            price: 0,
            price_sale: 0,
            discount: 0,
            volume_sold: 0,
            volume_24: 0,
            market_data: [],
            item_data: [],
            craftable: false,
            ingredients: []
        }

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

