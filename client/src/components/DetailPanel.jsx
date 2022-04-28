import React from 'react'
import MaterialTable, {MTableToolbar} from 'material-table'

function DetailPanel() {
    return (
        <div>
            <MaterialTable 
            style={{
            width: "100%",
            height: "100%",
        }}

          components={{
            Toolbar: props => (
                <div style={{ backgroundColor: '#f8f6f6' }}>
                    <MTableToolbar {...props} />
                </div>
            ),
        }}
          
          //options to be added to the table and can be set to true or false
          //like selection, search, export
          options={{
            exportButton: false,
            toolbar: false,
            search: false,
            paging: true,
            filtering: false,
            sorting: false,
            showTitle: false,
            rowStyle: {
                backgroundColor: '#fcfcfc',
              },
              
              headerStyle: {
                backgroundColor: '#f6f6f6',
                color: 'black',
              }
           }
          }
            />
        </div>
    )
}
export default DetailPanel
