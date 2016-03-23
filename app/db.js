const ipcRenderer = require('electron').ipcRenderer;
const pg = require('remote').require('pg');


// https://github.com/atom/electron/issues/4490
function fixTempIssue(data) {
  for (const field of data) {
    for (const fieldName in field) {
      if (field[fieldName] instanceof Date) {
        field[fieldName] = { IssueType: 'Date', value: field[fieldName].toString() };
      }
    }
  }
  return data;
}


export default class DB {
  static connect(params, callback) {
    if (params.useSSH) {
      ipcRenderer.send('ssh-connect', params);
      ipcRenderer.once('ssh-connect', (success) => {
        if (success) {
          const connectUrl = `postgres://${params.user}:${params.password}@${params.address}:5433/${params.database}`;
          this.connectDB(connectUrl, callback);
        }
      });
    } else {
      const connectUrl = `postgres://${params.user}:${params.password}@${params.address}:${params.port}/${params.database}`;
      this.connectDB(connectUrl, callback);
    }
  }

  static connectDB(connectUrl, callback) {
    pg.connect(connectUrl, (err, client, done) => {
      this.client = client;
      this.done = done;
      let isConnected = true;
      this.handleError(err);
      if (err) {
        isConnected = false;
      }
      callback.apply(null, [isConnected, err]);
    });
  }

  static disconnectDB() {
    pg.end();
  }

  static getTables(callback) {
    const query = `
      SELECT table_name
        FROM information_schema.tables
      WHERE table_schema='public'
        AND table_type='BASE TABLE';
    `;
    this.client.query(query, (err, result) => {
      this.handleError(err);
      callback.apply(null, [result.rows, err]);
    });
  }

  static getTableContent(params, callback) {
    let page = params.page;
    if (page === undefined) {
      page = 1;
    }

    const offset = (page - 1) * 100;
    let totalCount = 0;

    let order = params.order;
    if (order === undefined) {
      order = [];
    }

    let orderQuery = '';
    if (order.length) {
      orderQuery = 'ORDER BY ';
      for (const item of order) {
        orderQuery += `${item.fieldName} ${item.type}, `;
      }
    }
    orderQuery = orderQuery.slice(0, -2);
    this.client.query(`SELECT COUNT(*) FROM ${params.tableName};`, (err, result) => {
      totalCount = parseInt(result.rows[0].count, 10);
      const query = `
        SELECT * FROM ${params.tableName} ${orderQuery} LIMIT 100 OFFSET ${offset};
      `;
      this.client.query(query, (error, res) => {
        if (!offset) {
          const titleQuery = `
              SELECT column_name FROM information_schema.columns
              WHERE table_name='${params.tableName}';`;
          const structureQuery = `
              SELECT COLUMN_NAME AS ColumnName, DATA_TYPE AS DataType,
              CHARACTER_MAXIMUM_LENGTH AS CharacterLength
              FROM INFORMATION_SCHEMA.COLUMNS
              WHERE TABLE_NAME = '${params.tableName}';`;
          this.client.query(titleQuery, (titleError, resTitle) => {
            this.handleError(titleError);
            this.client.query(structureQuery, (structureError, resStructure) => {
              this.handleError(structureError);
              const structureTable = resStructure.rows;
              callback.apply(null, [
                fixTempIssue(res.rows), totalCount, order, page, titleTable, structureTable
              ]);
            });
            const titleTable = resTitle.rows.map(key => key.column_name);
            callback.apply(null, [fixTempIssue(res.rows), totalCount, order, page, titleTable]);
          });
        } else {
          callback.apply(null, [fixTempIssue(res.rows), totalCount, order, page]);
        }
      });
    });
  }

  static handleError(err) {
    if (err) {
      pg.end();
    }
  }

}
