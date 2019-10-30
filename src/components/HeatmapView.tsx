import * as React from 'react';
import { dataService } from '../services';
import $ from 'jquery';
import '@progress/kendo-ui';
import { setData } from '@telerik/kendo-intl';

export const HeatmapView = () => {
    const fetchData = async () => {
        const newData = await dataService.getAllSymbols();
        const prizeUpItemsCollection = newData.map(item => {
            if (item.change_pct.indexOf('-') !== 0) {
                let newItem = { value: 0, name: '', change: '' }
                newItem.value = parseInt(item.market_cap);
                newItem.name = item.symbol;
                newItem.change = item.change_pct;
                return newItem
            }
        })
        const prizeDownItemsCollection = newData.map(item => {
            if (item.change_pct.indexOf('-') === 0) {
                let newItem = { value: 0, name: '', change: '' }
                newItem.value = parseInt(item.market_cap);
                newItem.name = item.symbol;
                newItem.change = item.change_pct;
                return newItem
            }
        })
        const prizeUpItems = prizeUpItemsCollection.filter(item => item)
        const prizeDownItems = prizeDownItemsCollection.filter(item => item)
        let TreeData = [
            {
                name: 'Market capitalization', value: 1, items: [
                    { value: 1, name: 'Prize up', items: prizeUpItems, color: 'red' },
                    { value: 1, name: 'Prize down', items: prizeDownItems, color: 'green' }
                ]
            }
        ]
        const setData = (options: any) => {
            options.success(TreeData)
        }

        const renderItem = (props: any) => {
            return `<span>${props.text}<br/>${props.dataItem.change}%</span>`;
        }

        $("#heatmap").kendoTreeMap({
            template: renderItem,
            dataSource: new kendo.data.HierarchicalDataSource({
                transport: {
                    read: setData
                },
                schema: {
                    model: {
                        children: "items"
                    }
                }
            }),
            valueField: "value",
            textField: "name",
            colors: [["#006400", "#7fb17f"], ["#ff0000", "#ff6666"]]
        })

    }
    React.useEffect(() => { fetchData() }, []);
    return (
        <div>
            heatmap
            <div id='heatmap' style={{height: 600, marginBottom: 50}}></div>
        </div>
    )
}