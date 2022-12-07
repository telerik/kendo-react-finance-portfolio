import * as React from 'react';
import { LocalizationProvider, IntlProvider, load, loadMessages } from '@progress/kendo-react-intl';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { GridPDFExport } from '@progress/kendo-react-pdf';

import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import currencyData from 'cldr-core/supplemental/currencyData.json';
import weekData from 'cldr-core/supplemental/weekData.json';

import numbers from 'cldr-numbers-full/main/es/numbers.json';
import currencies from 'cldr-numbers-full/main/es/currencies.json';
import caGregorian from 'cldr-dates-full/main/es/ca-gregorian.json';
import dateFields from 'cldr-dates-full/main/es/dateFields.json';

import { process } from '@progress/kendo-data-query';
import orders from './data/orders.json';
import { GridDetailRow, Grid, GridToolbar, GridColumn } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';

import timeZoneNames from 'cldr-dates-full/main/es/timeZoneNames.json';
import esMessages from './data/es.json';
import { NavigationRow, Navigation } from '../components/Navigation/';


load(
    likelySubtags,
    currencyData,
    weekData,
    numbers,
    currencies,
    caGregorian,
    dateFields,
    timeZoneNames
);


loadMessages(esMessages, 'es-ES');


orders.forEach((o: any) => {
    o.orderDate = new Date(o.orderDate);
    o.shippedDate = o.shippedDate === 'NULL' ? undefined : new Date(o.shippedDate);
});


class DetailComponent extends GridDetailRow {
    render() {
        const dataItem = this.props.dataItem;
        return (
            <div>
                <section style={{ width: "200px", float: "left" }}>
                    <p><strong>Street:</strong> {dataItem.shipAddress.street}</p>
                    <p><strong>City:</strong> {dataItem.shipAddress.city}</p>
                    <p><strong>Country:</strong> {dataItem.shipAddress.country}</p>
                    <p><strong>Postal Code:</strong> {dataItem.shipAddress.postalCode}</p>
                </section>
                <Grid style={{ width: "500px" }} data={dataItem.details}></Grid>
            </div>
        );
    }
}

export class VirtualizedPage extends React.Component<any, any> {
    locales = [
        {
            language: 'en-US',
            locale: 'en'
        },
        {
            language: 'es-ES',
            locale: 'es'
        }
    ]
    constructor(props: any) {
        super(props);
        const dataState: any = {
            skip: 0,
            take: 20,
            sort: [
                { field: 'orderDate', dir: 'desc' }
            ],
            group: [
                { field: 'customerID' }
            ]
        };
        this.state = {
            dataResult: process(orders, dataState),
            dataState: dataState,
            currentLocale: this.locales[0]
        };
    }

    dataStateChange = (event: any) => {
        this.setState({
            dataResult: process(orders, event.dataState),
            dataState: event.dataState
        });
    }

    expandChange = (event: any) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;

        this.setState({ ...this.state });
    }

    _pdfExport: any;
    exportExcel = () => {
        this._export.save();
    }

    _export: any;
    exportPDF = () => {
        this._pdfExport.save();
    }

    render() {

        return (
            <>
                <div className="container my-3">
                    <NavigationRow className="row justify-content-center">
                        <Navigation className="col-12 flex-grow-1 text-center" />
                    </NavigationRow>
                </div>
                <div className="container">
                    <LocalizationProvider language={this.state.currentLocale.language}>
                        <IntlProvider locale={this.state.currentLocale.locale} >
                            <div>
                                <ExcelExport
                                    data={orders}
                                    ref={(exporter) => { this._export = exporter; }}
                                >
                                    <Grid
                                        style={{ height: '700px' }}
                                        sortable
                                        filterable
                                        groupable
                                        reorderable
                                        pageable={{ buttonCount: 4, pageSizes: true }}

                                        data={this.state.dataResult}
                                        {...this.state.dataState}
                                        onDataStateChange={this.dataStateChange}

                                        detail={DetailComponent}
                                        expandField="expanded"
                                        onExpandChange={this.expandChange}
                                    >
                                        <GridToolbar>
                                            Locale:&nbsp;&nbsp;&nbsp;
                                            <DropDownList
                                                value={this.state.currentLocale}
                                                textField="language"
                                                onChange={(e) => { this.setState({ currentLocale: e.target.value }); }}
                                                data={this.locales} />&nbsp;&nbsp;&nbsp;
                                            <button
                                                title="Export to Excel"
                                                className="k-button k-primary"
                                                onClick={this.exportExcel}
                                            >
                                                Export to Excel
                                            </button>&nbsp;
                                            <button className="k-button k-primary" onClick={this.exportPDF}>Export to PDF</button>
                                        </GridToolbar>
                                        <GridColumn field="customerID" width="200px" />
                                        <GridColumn field="orderDate" filter="date" format="{0:D}" width="300px" />
                                        <GridColumn field="shipName" width="280px" />
                                        <GridColumn field="freight" filter="numeric" width="200px" />
                                        <GridColumn field="shippedDate" filter="date" format="{0:D}" width="300px" />
                                        <GridColumn field="employeeID" filter="numeric" width="200px" />
                                        <GridColumn locked field="orderID" filterable={false} title="ID" width="90px" />
                                    </Grid>
                                </ExcelExport>
                                <GridPDFExport
                                    ref={(element) => { this._pdfExport = element; }}
                                    margin="1cm" >
                                    {<Grid data={process(orders, this.state.dataState)} >
                                        <GridColumn field="customerID" width="200px" />
                                        <GridColumn field="orderDate" filter="date" format="{0:D}" width="300px" />
                                        <GridColumn field="shipName" width="280px" />
                                        <GridColumn field="freight" filter="numeric" width="200px" />
                                        <GridColumn field="shippedDate" filter="date" format="{0:D}" width="300px" />
                                        <GridColumn field="employeeID" filter="numeric" width="200px" />
                                        <GridColumn locked field="orderID" filterable={false} title="ID" width="90px" />
                                    </Grid>}
                                </GridPDFExport>
                            </div>
                        </IntlProvider>
                    </LocalizationProvider>
                </div>
            </>
        );
    }
}