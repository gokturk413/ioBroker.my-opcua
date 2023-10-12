'use strict';

/*
 * Created with @iobroker/create-adapter v2.3.0awa
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const { settings } = require('cluster');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const edge = require('edge-js');
console.log(__dirname);
/*const myFunc = edge.func({
    assemblyFile: 'E:\\desktop 12_04_2023\\OpcUAClient-master\\KonsoleBrowse-master_ishleyir\\KonsoleBrowse-master\\KonsoleBrowseDll\\bin\\Debug\\KonsoleBrowseDll.dll',
    typeName: 'KonsoleBrowseDll.Program',
    methodName: 'Invoke',
    references: ['System.Data.dll','BouncyCastle.Crypto.dll','OPC.UA.Core.dll','Opc.Ua.Client.dll','Opc.Ua.Configuration.dll','System.IdentityModel.dll','System.Xml.dll']
});*/

const dllpath=__dirname+'\\csharp\\'+'KonsoleBrowseDll.dll';
const myFunc = edge.func({
    assemblyFile: dllpath,
    typeName: 'KonsoleBrowseDll.Program',
    methodName: 'Invoke',
    references: ['System.Data.dll','BouncyCastle.Crypto.dll','OPC.UA.Core.dll','Opc.Ua.Client.dll','Opc.Ua.Configuration.dll','System.IdentityModel.dll','System.Xml.dll']
});



const payload1 = {
    aString: 'browsenamespace',
};
const payload2={
    id:'ns=2;s=5852_Massa_brutto_za_proshedshiy_chas_uint32',
    val:63
};
const payload3={
    //nodeid:'ns=2;s=OpenIndustry',
    nodeid:'ns=2;s=Channel1',
};
/*myFunc(payload1 , function (err,res) {
    if(err) console.error(err);
    var srt= res.write(payload2);
});
myFunc(payload1 , function (err,res) {
    if(err) console.error(err);
    var dsd = res.browsenamespace();
});*/



// Load your modules here, e.g.:
// const fs = require("fs");






class MyOpcua extends utils.Adapter {

    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'my-opcua',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        const endpoint = this.config.endpoint;//settings.endpoint;
        const Anonymous = this.config.Anonymous;
        const username = this.config.username;
        const password = this.config.password;
        const sec_policy = this.config.sec_policy;
        const Mes_sec_mode = this.config.Mes_sec_mode;
        const activate_cert = this.config.activate_cert;
        const certificate1 = this.config.certificate1;
        const cert_key = this.config.cert_key;

        const set = (data) =>
        {
            if(data!=null)
            {
                this.setstates(data);
            }
        };


        const input ={
            /*Keep_AliveEventHandler: function (data, callback) {
                console.log(data);
                callback(error, result)
            },*/
            MessageEventHandler: function (data, callback) {
                set(data);
                callback(Error, result);
            },
            BrowseTopicHandler: function (data, callback) {
                //console.log(data);
                callback(Error, result);
            },
            Messagestart: function (data, callback) {
                //console.log(data);
                callback(Error, result);
            },
            /*BrowseTopicNamespaces: function (data, callback) {
                console.log(data);
                callback(error, result)
            },*/
            endpoint : endpoint,
            topic : 'Stansiya479',
            sessionid :'Stansiya479',
            Anonymous:Anonymous,
            username : username,
            password : password,
            sec_policy :sec_policy,
            Mes_sec_mode : Mes_sec_mode,
            activate_cert: activate_cert,
            certificate1:certificate1,
            cert_key:cert_key
        };

        let opt = {
            include_docs: true
        };
        /*opt.startkey = 'my-opcua.' + this.instance + '.';
        opt.endkey = 'my-opcua.' + this.instance + '.';
        const obj1 = this.getObjectList(opt, function (err, obj) {
            // this.setState('4850_password_ASCII8','salam');
            let jhf = obj;
        });*/


        let date = new Date();
        console.log('----> start ('+ date.toString() +') ');

        myFunc(input,function (error, payload) {
            if (error) throw error;
            date = new Date();
            console.log('----> end ('+ payload +')');});


        const myfunction = myFunc(payload1, true);
        const adsss = myfunction.browsenamespace(null, true);
        //const adsss1 = myfunction.write(payload2,true);
        //const adsss3 = myfunction.browser(payload3,true);

        // Initialize your adapter here

        // Reset the connection indicator during startup
        this.setState('info.connection', true, true);
        //this.setState('my-opcua.0.*.ns=2___s=Data___Type___Examples___16___Bit___Device___K___Registers___Boolean1','true');
        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info('config option1: ' + this.config.endpoint);
        this.log.info('config option2: ' + this.config.username);

        //this.setStateAsync('OpenIndustry.Stansiya479.4850_password_ASCII8' ,  'abc');
        /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        */
        /*await this.setObjectNotExistsAsync('testVariable', {
            type: 'state',
            common: {
                name: 'testVariable',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: true,
            },
            native: {},
        });*/

        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        //this.subscribeStates('testVariable');
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates('lights.*');
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        this.subscribeStates('*');

        /*
            setState examples
            you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        */
        // the variable testVariable is set to true as command (ack=false)
        //await this.setStateAsync('testVariable', true);

        // same thing, but the value is flagged "ack"
        // ack should be always set to true if the value is received from or acknowledged from the target system
        //await this.setStateAsync('testVariable', { val: true, ack: true });

        // same thing, but the state is deleted after 30s (getState will return null afterwards)
        //await this.setStateAsync('testVariable', { val: true, ack: true, expire: 30 });

        // examples for the checkPassword/checkGroup functions
        let result = await this.checkPasswordAsync('admin', 'iobroker');
        this.log.info('check user admin pw iobroker: ' + result);

        result = await this.checkGroupAsync('admin', 'admin');
        this.log.info('check group user admin group admin: ' + result);


        let startupnodes=[];
        this.getForeignObjectsAsync('my-opcua.'+this.instance +'.*',  (err, obj) => {
            if(obj!=null)
            {
                Object.values(obj).forEach(val => {
                    //const [key, value] = val;
                    if(!val._id.startsWith('my-opcua.'+this.instance+'.info'))
                    {
                        startupnodes.push(val.common.name);
                    }
                });
                //});
                if(startupnodes!=null)
                {
                    const nodespayload={
                        checkednodes: startupnodes
                    };
                    const nodes = myfunction.addmonitorcheckednodes(nodespayload,true);
                }
            }
        });

    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */



    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  * @param {string} id
    //  * @param {ioBroker.Object | null | undefined} obj
    //  */
    // onObjectChange(id, obj) {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            //let idsd= this.getIdByName();
            if(!id.startsWith('my-opcua.'+this.instance+'.info')){
                //this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
                if(state.from!='system.adapter.my-opcua.'+this.instance+'')
                {
                    this.getObject(id, function (err, obj) {
                        const opc_tag = obj.common.name;
                        const myfunction = myFunc(payload1, true);
                        const payload_tag={
                            id:opc_tag,
                            val:state.val
                        };
                        const adsss1 = myfunction.write(payload_tag, true);
                    });
                }
            }

        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    /**
      * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
      * Using this method requires "common.messagebox" property to be set to true in io-package.json
      * @param {ioBroker.Message} obj
      */
    onMessage(obj) {
        if (typeof obj === 'object' && obj.message) {
            if (obj.command === 'send') {
                // e.g. send email or pushover or whatever
                this.log.info('send command');

                // Send response in callback if required
                if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
            }
            if (obj.command === 'test') {
            // e.g. send email or pushover or whatever
                this.log.info('test command');

                // Send response in callback if required
                const myfunction = myFunc(payload1, true);
                const rootfolders = myfunction.browserootfolders(null,true);
                if (obj.callback) this.sendTo(obj.from, obj.command, rootfolders, obj.callback);
            }
            if (obj.command === 'browser') {
                // e.g. send email or pushover or whatever
                const nodepayload={
                    nodeid:obj.message.nodeid,
                };
                this.log.info('browser command');
                // Send response in callback if required
                const myfunction = myFunc(payload1, true);
                const nodefolders = myfunction.browser(nodepayload,true);
                if (obj.callback) this.sendTo(obj.from, obj.command, nodefolders, obj.callback);
            }
            if(obj.command==='createstates')
            // eslint-disable-next-line no-empty
            {
                const treepayload={
                    checkednodes:obj.message.allcheckednodes
                };
                this.iteratorfirst(obj.message.allcheckednodes, obj.message.treeData, );
                const myfunction = myFunc(payload1, true);
                const checkednodes = myfunction.addmonitorcheckednodes(treepayload,true);
                const sbcvss= 1+1;
                //this.iterator(obj.message.treeData,null);
            }
        }
    }

    async setstates(data)
    {
        let statepath = await this.replacefuncstate(data.nodeid);
        this.setState('my-opcua.'+this.instance+'.'+statepath, data.value,true/*ack*/);
    }

    iteratorfirst(_checkednodes, _tree)
    {
        _checkednodes.forEach(async (checkednodeid) => {
            const retvalue = this.search(_tree, checkednodeid);
            //printAncestors(_tree, checkednodeid);
            this.iterator(retvalue,null);
            const sbcv= 1+1;
        });
    }

    search(nodes, value) {
        let result;
        nodes.some(o => {
            let children;
            if (o.id === value) {
                return result = o;
            }
            if (o.child && (children = this.search(o.child, value))) {
                return result = Object.assign({}, o, { children });
            }
        });
        return result && [result];
    }

    async replacefunc(nodename)
    {
        let prtnodename = '';
        //v.replace(/[,?[\]]+/g, '');
        prtnodename= nodename.replace(/[\][*,;'"`<>\\\s?]+/g, '');
        return prtnodename;
    }

    async replacefuncstate(nodename)
    {
        let prtnodename = '';
        //v.replace(/[,?[\]]+/g, '');
        prtnodename= nodename.replace(/[\].[*,;'"`<>\\\s?]+/g, '___');
        return prtnodename;
    }


    async iterator(tree, parentnodename)
    {

        tree.forEach(async (parentNode) => {

            if(parentnodename!=null)
            {
                //let checkspecchar = parentnodename.indexOf('.') === -1 ? false : true;
                //if(checkspecchar==true)
                //{
                if(parentNode.nodeclass=='Object')
                {

                    /*await this.setObjectNotExistsAsync(await this.replacefunc(parentnodename)+'.'+await this.replacefunc(parentNode.name), {
                            type: 'channel',
                            common: {
                                name: parentNode.id
                            },
                            native: {}
                        });*/
                }
                else
                {
                    await this.setObjectNotExistsAsync(await this.replacefuncstate(parentNode.id), {
                        type: 'state',
                        common: {
                            name: parentNode.id,
                            type: parentNode.datatype,
                            role: 'value',
                            read: true,
                            write: true,
                        },
                        native: {},
                    });
                }
                //}
            }
            else
            {
                /* await this.setObjectNotExistsAsync(await this.replacefunc(parentNode.name), {
                    type: 'channel',
                    common: {
                        name: parentNode.id
                    },
                    native: {}
                });*/
            }

            if (Object.prototype.hasOwnProperty.call(parentNode,'children')) {
                if(parentnodename!=null)
                {
                    parentnodename+='.'+parentNode.name;
                    this.iterator(parentNode.children,parentnodename);
                }
                else
                {
                    this.iterator(parentNode.children,parentNode.name);
                }
            }
        });
    }

    /*async iterator(tree, parentnodename)
    {
        tree.forEach(async (parentNode) => {

            if(parentnodename!=null)
            {
                let checkspecchar = parentnodename.indexOf('.') === -1 ? false : true;
                if(checkspecchar==true)
                {
                    if(parentNode.nodeclass=='Object')
                    {

                        await this.setObjectNotExistsAsync(await this.replacefunc(parentnodename)+'.'+await this.replacefunc(parentNode.name), {
                            type: 'channel',
                            common: {
                                name: parentNode.id
                            },
                            native: {}
                        });
                    }
                    else
                    {
                        await this.setObjectNotExistsAsync(await this.replacefunc(parentnodename)+'.'+ await this.replacefuncstate(parentNode.id), {
                            type: 'state',
                            common: {
                                name: parentNode.id,
                                type: parentNode.datatype,
                                role: 'value',
                                read: true,
                                write: true,
                            },
                            native: {},
                        });
                    }
                }
            }
            else
            {
                await this.setObjectNotExistsAsync(await this.replacefunc(parentNode.name), {
                    type: 'channel',
                    common: {
                        name: parentNode.id
                    },
                    native: {}
                });
            }

            if (Object.prototype.hasOwnProperty.call(parentNode,'children')) {
                if(parentnodename!=null)
                {
                    parentnodename+='.'+parentNode.name;
                    this.iterator(parentNode.children,parentnodename);
                }
                else
                {
                    this.iterator(parentNode.children,parentNode.name);
                }
            }
        });
    }*/
}



if (require.main !== module) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new MyOpcua(options);
} else {
    // otherwise start the instance directly
    new MyOpcua();
}