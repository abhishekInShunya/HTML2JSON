let button = document.getElementById('btn');

button.addEventListener('click', () => {
    var initElement = document.getElementById("transform").value;
    console.log(initElement);

    var json = mapDOM(initElement, true);
    document.getElementById('container').innerHTML = json;
    console.log(json);
})

function mapDOM(element, json) {
    var treeObject = {};
    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
            parser = new DOMParser();
            docNode = parser.parseFromString(element, "text/xml");
        }
        else // Microsoft strikes again
        {
            docNode = new ActiveXObject("Microsoft.XMLDOM");
            docNode.async = false;
            docNode.loadXML(element);
        }
        element = docNode.firstChild;
    }

    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object["kind"] = element.nodeName;
        var nodeList = element.childNodes;
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                }
            }
        }
        if (nodeList != null) {
            if (nodeList.length) {
                object["child"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        object["child"].push(nodeList[i].nodeValue);
                    } else {
                        object["child"].push({});
                        treeHTML(nodeList[i], object["child"][object["child"].length - 1]);
                    }
                }
            }
        }
        
    }
    
    treeHTML(element, treeObject);
    // console.log(JSON.stringify(treeObject));
    return (json) ? JSON.stringify(treeObject) : treeObject;
}