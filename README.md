# clientPaginate
This plugin aims to repeat a JSON array into an html template on the client side and adds pagination options as well.

| Option  | Type  | Default  | Description  |
|---|---|---|---|
| paginate  | Boolean  | true  | Whether to only repeat or to add pagination options as well. |
|  data | Array  |  []  | The JSON array from which the plugin will repeat.  |
|  htmlTemplate |  HTML String or jQuery elemnt object | ““  |  The HTML element from that the plugin will take as template.
More on that after the table to check the special attributes. |
| objectTemplate  |  Javascript object | {}  | A single input from the array to repeat a sample from in case of empty data array.  |
| search  | Boolean  |  true | Adds search field.  |
| buttons  | HTML String or jQuery elemnt object  | false  | Adds these buttons for special events.
PS: Buttons can take special attribute pagination-actions=\"repeatElement\" if the button has no purpose but to add a new element to array.
Ex: "<button type='button' class=\"actionLink level2 active save\" pagination-actions=\"repeatElement\">Add New</button>"  |
| elementsPerPage  | Number  | 20  | In case of pagination, the default number of elements per page.  |
| validation  | Array  | null  | This array takes two fields:

Array of required fields to validate client side.

Section name to point in case of error message.

Ex: validation = [ [id,name],”Some important section” ]
Then on form submission if there is any validation error, the message will be the following:
”Some important section: Missing required fields at element number : 3”
And it adds the error red circle on the right of this specific field.  |
|  startWith | Number/String  | 0  | The page to start with. I can accepts "last" as a value.  |
| empty  |  String | repeat  | An error message in case of empty data array.
The default is to repeat from the empty objectTemplate provided before.  |
| allData  | String  | allData  | In case of form submission all data will be added to one hidden field as a JSON object, so you can choose that field name in order to catch it on the back end side.  |
| callback  | function  | function(){}  | A callback function to be executed after each action that includes repeating (loading, filtering,…). |
