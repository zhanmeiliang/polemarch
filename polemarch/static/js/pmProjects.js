 
var pmProjects = new pmItems()  
pmProjects.model.name = "projects"
 
/** 
 * @return $.Deferred
 */
pmProjects.addItem = function()
{ 
    var def = new $.Deferred();
    var data = {}

    data.name = $("#new_project_name").val()
    data.repository = $("#new_project_repository").val()
    data.vars = pmProjects.jsonEditorGetValues()
     
    if(!data.name)
    {
        $.notify("Invalid value in filed name", "error");
        def.reject()
        return def.promise();
    }
 
    $.ajax({
        url: "/api/v1/projects/",
        type: "POST",
        contentType:'application/json',
        data: JSON.stringify(data),
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        },
        success: function(data)
        { 
            $.notify("project created", "success");
            $.when(spajs.open({ menuId:"project/"+data.id})).always(function(){
                def.resolve()
            })
        },
        error:function(e)
        {
            def.reject()
            polemarch.showErrors(e.responseJSON)
        }
    }); 
    
    return def.promise();
}

/** 
 * @return $.Deferred
 */
pmProjects.updateItem = function(item_id)
{
    var data = {}

    data.name = $("#project_"+item_id+"_name").val()
    data.vars = pmProjects.jsonEditorGetValues()
    
    if(!data.name)
    {
        console.warn("Invalid value in filed name")
        $.notify("Invalid value in filed name", "error");
        return;
    }
 
    return $.ajax({
        url: "/api/v1/projects/"+item_id+"/",
        type: "PATCH",
        contentType:'application/json',
        data:JSON.stringify(data),
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        },
        success: function(data)
        { 
            $.notify("Save", "success");
        },
        error:function(e)
        {
            console.log("project "+item_id+" update error - " + JSON.stringify(e)); 
            polemarch.showErrors(e.responseJSON)
        }
    });
}
 
/**
 * Показывает форму со списком всех групп.
 * @return $.Deferred
 */
pmProjects.showAddSubInventoriesForm = function(item_id, holder)
{
    return $.when(pmInventories.loadItems()).done(function(){
        $("#add_existing_item_to_project").remove()
        $(".content").append(spajs.just.render('add_existing_inventories_to_project', {item_id:item_id}))
        $("#polemarch-model-items-select").select2();
    }).fail(function(){

    }).promise()
}

/**
 * Показывает форму со списком всех групп.
 * @return $.Deferred
 */
pmProjects.showAddSubInventoriesForm = function(item_id, holder)
{
    return $.when(pmInventories.loadItems()).done(function(){
        $("#add_existing_item_to_project").remove()
        $(".content").append(spajs.just.render('add_existing_inventories_to_project', {item_id:item_id}))
        $("#polemarch-model-items-select").select2();
    }).fail(function(){

    }).promise()
}

/**
 * Показывает форму со списком всех групп.
 * @return $.Deferred
 */
pmProjects.showAddSubGroupsForm = function(item_id, holder)
{
    return $.when(pmGroups.loadItems()).done(function(){
        $("#add_existing_item_to_project").remove()
        $(".content").append(spajs.just.render('add_existing_groups_to_project', {item_id:item_id}))
        $("#polemarch-model-items-select").select2();
    }).fail(function(){

    }).promise()
}

/**
 * Показывает форму со списком всех хостов.
 * @return $.Deferred
 */
pmProjects.showAddSubHostsForm = function(item_id, holder)
{
    return $.when(pmHosts.loadItems(99999)).done(function(){
        $("#add_existing_item_to_project").remove()
        $(".content").append(spajs.just.render('add_existing_hosts_to_project', {item_id:item_id}))
        $("#polemarch-model-items-select").select2();
    }).fail(function(){

    }).promise()
}

/**
 * Проверяет принадлежит ли host_id к группе item_id
 * @param {Integer} item_id
 * @param {Integer} host_id
 * @returns {Boolean}
 */
pmProjects.hasHosts = function(item_id, host_id)
{
    if(pmProjects.model.items[item_id])
    {
        for(var i in pmProjects.model.items[item_id].hosts)
        {
            if(pmProjects.model.items[item_id].hosts[i].id == host_id)
            {
                return true;
            }
        }
    }
    return false;
}

/**
 * Проверяет принадлежит ли host_id к группе item_id
 * @param {Integer} item_id
 * @param {Integer} host_id
 * @returns {Boolean}
 */
pmProjects.hasGroups = function(item_id, group_id)
{
    if(pmProjects.model.items[item_id])
    {
        for(var i in pmProjects.model.items[item_id].groups)
        {
            if(pmProjects.model.items[item_id].groups[i].id == group_id)
            {
                return true;
            }
        }
    }
    return false;
}

/**
 * Проверяет принадлежит ли Inventory_id к группе item_id
 * @param {Integer} item_id
 * @param {Integer} inventory_id
 * @returns {Boolean}
 */
pmProjects.hasInventories = function(item_id, inventory_id)
{
    if(pmProjects.model.items[item_id])
    {
        for(var i in pmProjects.model.items[item_id].inventories)
        {
            if(pmProjects.model.items[item_id].inventories[i].id == inventory_id)
            {
                return true;
            }
        }
    }
    return false;
}

 
/**
 * @return $.Deferred
 */
pmProjects.setSubInventories = function(item_id, inventories_ids)
{
    if(!inventories_ids) 
    {
        inventories_ids = []
    }
    
    return $.ajax({
        url: "/api/v1/projects/"+item_id+"/inventories/",
        type: "PUT",
        contentType:'application/json',
        data:JSON.stringify(inventories_ids),
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        },
        success: function(data)
        { 
            if(pmProjects.model.items[item_id])
            {
                pmProjects.model.items[item_id].inventories = []
                for(var i in inventories_ids)
                {
                    pmProjects.model.items[item_id].inventories.push(pmInventories.model.items[inventories_ids[i]])
                }
            }
            console.log("inventories update", data);
            $.notify("Save", "success");
        },
        error:function(e)
        {
            console.log("inventories "+item_id+" update error - " + JSON.stringify(e));
            polemarch.showErrors(e.responseJSON)
        }
    });
}
 
/**
 * @return $.Deferred
 */
pmProjects.setSubGroups = function(item_id, groups_ids)
{
    if(!groups_ids) 
    {
        groups_ids = []
    }
    
    return $.ajax({
        url: "/api/v1/projects/"+item_id+"/groups/",
        type: "PUT",
        contentType:'application/json',
        data:JSON.stringify(groups_ids),
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        },
        success: function(data)
        { 
            if(pmProjects.model.items[item_id])
            {
                pmProjects.model.items[item_id].groups = []
                for(var i in groups_ids)
                {
                    pmProjects.model.items[item_id].groups.push(pmGroups.model.items[groups_ids[i]])
                }
            }
            console.log("group update", data);
            $.notify("Save", "success");
        },
        error:function(e)
        {
            console.log("group "+item_id+" update error - " + JSON.stringify(e));
            polemarch.showErrors(e.responseJSON)
        }
    });
}

/**
 * @return $.Deferred
 */
pmProjects.setSubHosts = function(item_id, hosts_ids)
{
    if(!hosts_ids) 
    {
        hosts_ids = []
    }
    return $.ajax({
        url: "/api/v1/projects/"+item_id+"/hosts/",
        type: "PUT",
        contentType:'application/json',
        data:JSON.stringify(hosts_ids),
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        },
        success: function(data)
        {
            if(pmProjects.model.items[item_id])
            {
                pmProjects.model.items[item_id].hosts = []
                for(var i in hosts_ids)
                {
                    pmProjects.model.items[item_id].hosts.push(pmHosts.model.items[hosts_ids[i]])
                }
            } 
            $.notify("Save", "success");
        },
        error:function(e) 
        {
            console.log("project "+item_id+" update error - " + JSON.stringify(e));
            polemarch.showErrors(e.responseJSON)
        }
    });
} 

/**
 * @return $.Deferred
 */
pmProjects.syncRepo = function(item_id)
{ 
    return $.ajax({
        url: "/api/v1/projects/"+item_id+"/sync/",
        type: "POST",
        contentType:'application/json', 
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        },
        success: function(data)
        { 
            $.notify("Send sync query", "success");
        },
        error:function(e) 
        {
            console.log("project "+item_id+" sync error - " + JSON.stringify(e));
            polemarch.showErrors(e.responseJSON)
        }
    });
} 