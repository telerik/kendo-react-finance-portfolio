import * as React from 'react';
import { dataService } from '../services';
import $ from 'jquery';
import '@progress/kendo-ui';
import { Tooltip } from '@progress/kendo-react-tooltip';

export const HeatmapView = () => {
    const fetchData = async () => {
        const newData = await dataService.getAllSymbols();
        const prizeUpItemsCollection = newData.map((item: any) => {
            if (item.change_pct.indexOf('-') !== 0) {
                let newItem = { value: 0, name: '', change: '' }
                newItem.value = parseInt(item.market_cap);
                newItem.name = item.symbol;
                newItem.change = item.change_pct;
                return newItem
            }
        })
        const prizeDownItemsCollection = newData.map((item: any) => {
            if (item.change_pct.indexOf('-') === 0) {
                let newItem = { value: 0, name: '', change: '' }
                newItem.value = parseInt(item.market_cap);
                newItem.name = item.symbol;
                newItem.change = item.change_pct;
                return newItem
            }
        })
        const prizeUpItems = prizeUpItemsCollection.filter((item: any) => item)
        const prizeDownItems = prizeDownItemsCollection.filter((item: any) => item)
        let TreeData = [
            {
                name: 'Market capitalization', value: 1, items: [
                    { value: 1, name: "Price up", items: prizeUpItems },
                    { value: 1, name: "Price down", items: prizeDownItems }
                ]
            }
        ]
        const setData = (options: any) => {
            options.success(TreeData)
        }

        const renderItem = (props: any) => {
            let title = JSON.stringify(props.dataItem)
            return `<span title=${title}>${props.text}<br/>${props.dataItem.change}%</span>`;
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
            colors: [["#00AD51", "#00EF81"], ["#FF0000", "#FF8F8F"]]
        })

    }

    React.useEffect(() => { fetchData() }, []);
    return (
        <div>
            <div id='heatmap' style={{ height: 600, marginBottom: 50 }}></div>
        </div>
    )
}