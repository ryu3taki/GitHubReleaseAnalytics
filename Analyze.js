const params = new URLSearchParams(window.location.search);

const error_invalidURL = "正しいURLを入力してください。"
function analyze(url){
    var parsedURL = url.split('/');
    if(parsedURL.length != 5) return error_invalidURL;
    if(parsedURL[0] != "https:") return error_invalidURL;
    if(parsedURL[1] != "") return error_invalidURL;
    if(parsedURL[2] != "github.com") return error_invalidURL;

    var json;
    $.ajax({
        type: "GET",
        url: "https://api.github.com/repos/" + parsedURL[3] + '/' + parsedURL[4] + "/releases",
        async : false,
        dataType: 'json',
    }).done(function(data) {
        json = data;
    });
    
    if(json == null)return "エラー：URLを確認してください。";

    result = $("<div>");
    json.forEach(release => {
        let table = $("<table>").append($("<thead>").append($("<tr>").append($("<th>", { text:release["tag_name"] }))));
        
        let tbody = $("<tbody>");
        var assets = release["assets"];
        assets.forEach(asset => {
            let tr = $("<tr>");
            tr.append($("<td>", { text: asset["name"]}));
            tr.append($("<td>", { text: asset["download_count"]}));
            tbody.append(tr);
        });
        table.append(tbody);
        result.append(table);
    });

    return result.html();
};

function onClickButton(){
    var url = document.getElementById("repositoryURL").value;
    params.set("repository", url);
    window.location.search = params.toString();
}

if(params.has("repository")){
    var url = document.getElementById("repositoryURL").value = params.get("repository");
    document.getElementById("Result").innerHTML = analyze(url);
}