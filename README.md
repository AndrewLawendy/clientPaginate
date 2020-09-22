# clientPaginate
This plugin aims to repeat a JSON array into an html template on the client side and adds pagination options as well.

![GitHub](https://img.shields.io/github/license/AndrewLawendy/clientPaginate)
![GitHub package.json version](https://img.shields.io/github/package-json/v/AndrewLawendy/clientPaginate)
![npm](https://img.shields.io/npm/dw/client-paginate)
![GitHub file size in bytes](https://img.shields.io/github/size/AndrewLawendy/clientPaginate/src/clientPaginate.js)

[![NPM](https://nodei.co/npm/client-paginate.png?downloads=true)](https://nodei.co/npm/client-paginate/)

| Option  | Type  | Default  | Description  |
|---|---|---|---|
| `paginate`  | Boolean  | true  | Whether to only repeat or to add pagination options as well. |
|  `data` | Array  |  []  | The JSON array from which the plugin will repeat.  |
|  `htmlTemplate` |  HTML String or jQuery elemnt object | ““  |  The HTML element from that the plugin will take as template. More on that after the table to check the special attributes. |
| `objectTemplate`  |  Javascript object | {}  | A single input from the array to repeat a sample from in case of empty data array.  |
| `search`  | Boolean  |  true | Adds search field.  |
| `buttons`  | HTML String or jQuery elemnt object  | false  | Adds these buttons for special events. **PS**: Buttons can take special attribute `pagination-actions=\"repeatElement\"` if the button has no purpose but to add a new element to array. **Ex**: "<button type='button' class=\"actionLink level2 active save\" pagination-actions=\"repeatElement\">Add New</button>"  |
| `elementsPerPage`  | Number  | 20  | In case of pagination, the default number of elements per page.  |
| `validation`  | Array  | null  | This array takes two fields: Array of required fields to validate client side. Section name to point in case of error message. Ex: validation = [ [id,name],”Some important section” ] Then on form submission if there is any validation error, the message will be the following: **”Some important section: Missing required fields at element number : 3”** And it adds the error red circle on the right of this specific field.  |
|  `startWith` | Number/String  | 0  | The page to start with. I can accepts "last" as a value.  |
| `empty`  |  String | repeat  | An error message in case of empty data array. The default is to repeat from the empty `objectTemplate` provided before.  |
| `allData`  | String  | allData  | In case of form submission all data will be added to one hidden field as a JSON object, so you can choose that field name in order to catch it on the back end side.  |
| `callback`  | function  | function(){}  | A callback function to be executed after each action that includes repeating (loading, filtering,…). |

---
## data:
In order to display a server side validation, it’s enough to add an `invalid` field in the object having a string of comma separated invalid fields after server validation.

Ex: [
{id:1,name:title},
{id:null,name:title,invalid:”id”},
{id:null,name:wrongTitle,invalid:”id,name”}
]

---
## htmlTemplate:
The reason this option has its own section that it has many special attributes to guide the repeater function.

| Option  | Required  | Type  | Description  |
|---|---|---|---|
| `{$index}`  | Optional  | Anywhere (Attribute, class, id, text,..etc)  | It can be added anywhere to reuse the item index.  |
|  `init-value` | Required  |  Attribute |  It takes the field from which it will have the value. **Ex:** `<span init-value='id'></span>` |
| `opt-value`  | Optional  | Attribute  | Valid only with `<option>` as it takes a text -already done by  `init-value`-and then it needs a value, so this attributes contains the field from which the option will take the value. **Ex:** <option `init-value='text'` `opt-value='value'` ></option> |
| `repeat-fn`  | Optional  | Attribute  | Pass the field data through a function and return a new one value to repeat from. **Ex:** You need to replace “_“ into a regular space for displaying purpose. <span `repeat-fn="newVal.replace('_', ':')`"></span> **newVal** is the keyword to use. |
| `conversion-fn`  | Optional  | Attribute  | While updating the one hidden field before you might need to convert the data into something else. **Ex:** <span `conversion-fn='item.attr('test')+newVal.replace(':', '_')'`></span> And it takes the actual **item** and its value as **newVal** keyword. |
| `checkbox-val`  | Optional  | Attribute  | It takes a string to show of values to assign the checkbox in case of checked or in unchecked. **Ex:** `<input type=”checkbox” checkbox-val=”1,0” />` Now in case of checked the checkbox will take 1 as a value, and 0 in case of unchecked.|

---

**Example:**

    $('div').clientPaginate({
        data:[{ id: 1, name: "Title 1" },{id: 2, name: "Title 2" }],
        htmlTemplate: “<div class='container'><span  init-value='id'></span><span init-value='name'></span></div>“,
        objectTemplate:{id:'',name:''},
    });
