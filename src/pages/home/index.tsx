import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "./index.less";

const Home: React.FC<{}> = () => {
  const [showTimeReadOnly, setshowTimeReadOnly] = useState(true);
  const [nowTime, setnowTime] = useState(5);
  const [active, setactive] = useState("All");
  const [newNodesValue, setnewNodesValue] = useState("");
  const [demoLiValue, setdemoLiValue] = useState<any>([]);
  const [ClearValue, setClearValue] = useState("");
  const [itemsLeft, setitemsLeft] = useState(0);
  const [nowDoubleClick, setnowDoubleClick] = useState(0);
  let timer: any;

  const ulRef = useRef<any>();
  const divRef = useRef<any>();
  const history = useHistory();

  // 时间变化
  useEffect(() => {
    timer = setTimeout(() => {
      const counter = parseInt(nowTime + "") - 1;
      setnowTime(counter);
    }, 1000);
    if (nowTime === 0) {
      clearTimeout(timer);
      history.push("/other");
    }
  }, [nowTime]);

  useEffect(() => {}, [ClearValue]);

  useEffect(() => {
    setitemsLeft(demoLiValue.length);
  }, [demoLiValue]);

  // 设置全选和全不选
  const handleToggleAll = (e: any) => {
    // 判断全选按钮是否被选中
    if (e.target.checked) {
      // 找到 ul 列表的 li子节点，遍历改变checked的状态并且添加类名
      ulRef.current.childNodes.forEach((item: any) => {
        item.childNodes[0].childNodes[0].checked = true;
        item.classList.add("completed");
      });
      setitemsLeft(0); // 全选中，左下方的值为0
    } else {
      // 全不选则和上面的相反
      ulRef.current.childNodes.forEach((item: any) => {
        item.childNodes[0].childNodes[0].checked = false;
        item.classList.remove("completed");
      });
      setitemsLeft(demoLiValue.length); // 改为数据的长度
    }
  };

  const handleLabelDoubleClick = (e: any) => {
    e.target.parentNode.parentNode.classList.add("editing"); //给li添加一个类名
    e.target.parentNode.classList.add("hidden"); //给li添加一个类名
  };

  // 失去焦点和按下回车键之后，输入框隐藏，显示label
  const handleInputBlur = (e: any) => {
    e.target?.parentNode?.classList.remove("editing"); //去掉li的类名
    e.target.classList.remove("visable"); // 移除input之前创建的visable类名
    e.target.classList.add("hidden");
    e.target.parentNode?.childNodes[0].classList.remove("hidden"); // 移除div之前创建的hidden类名

    demoLiValue[nowDoubleClick] = {
      name: e.target.value,
      value: e.target.value,
    }; // 根据ul绑定的事件代理，找到正在修改的节点序号，然后更改数组对应的数据
    setdemoLiValue([...demoLiValue]);
  };

  // 加载节点列表
  const handleDemoList = () =>
    demoLiValue?.map((item: any, index: number) => (
      <li key={index}>
        <div className="view" ref={divRef}>
          <input
            type="checkbox"
            className="toggle"
            onChange={(e) => handleDemoListChange(e)}
          />
          <label onDoubleClick={(e) => handleLabelDoubleClick(e)}>
            {item.name}
          </label>
          <button
            className="destroy"
            value={item.name}
            onClick={(e) => {
              // 点击每个 li 后面的红色×时，就过滤掉全部数据中当前的数值，达到删除的目的
              setdemoLiValue(
                demoLiValue.filter(
                  (item: any) => item.name !== e.target["value"]
                )
              );
            }}
          ></button>
        </div>
        <input
          className="edit"
          defaultValue={item.value}
          onBlur={(e) => handleInputBlur(e)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleInputBlur(e);
            }
          }}
        />
      </li>
    ));

  // 数据列表change
  const handleDemoListChange = (e: any) => {
    // 单独选中的时候，改变某一个 li的属性
    if (e.target.checked) {
      e.target?.parentNode?.parentNode?.classList.add("completed");
    } else {
      e.target?.parentNode?.parentNode?.classList.remove("completed");
    }
    // 单独选中后，遍历全部的 li,看有多少 li是有completed类名的，然后左下角的数值变化
    let li = e.target?.parentNode?.parentNode?.parentNode?.childNodes;
    let nowCheck = 0;
    li?.forEach((item: any) => {
      if (item.classList.contains("completed")) {
        nowCheck += 1;
      }
    });
    setitemsLeft(demoLiValue.length - nowCheck);
  };

  // 删除已选择的
  const handleClearCompleted = () => {
    let arr: any = [];
    // 遍历li,根据li中设置了completed类，获得当前的值
    ulRef.current.childNodes.forEach((item: any) => {
      if (item.classList.contains("completed")) {
        arr.push(item.innerText);
        // 删除之后要把li上面的样式也给去掉，否则删完后下一个节点依然被选中
        item.classList.remove("completed");
        item.childNodes[0].childNodes[0].checked = false;
      }
    });
    // 然后二者对比，删除全部数据中被勾选上的数据
    for (var i = 0; i < demoLiValue.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (demoLiValue[i].name === arr[j]) {
          demoLiValue.splice(i, 1);
        }
      }
    }
    setdemoLiValue([...demoLiValue]);
  };

  // 通过事件代理的方式找到正在修改的label
  const handleEventAgent = (ev: any) => {
    let allLi = ev.currentTarget.childNodes; //获取所有的li标签
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement; // target表示在事件冒泡中触发事件的源元素，在IE中是srcElement
    if (target.nodeName.toLowerCase() == "label") {
      for (let i = 0; i < allLi.length; i++) {
        //判断点击的label和第几个li下面的label是一样的，就可以得到当前 li的序号
        if (allLi[i].childNodes[0].childNodes[1] === target) {
          setnowDoubleClick(i); // 当前点击的li节点序号
        }
      }
    }
  };

  return (
    <div className="parent">
      {/* 展示时间 */}
      <div className="showTime">
        <input
          type="text"
          value={nowTime > 10 ? nowTime : "0" + nowTime} //保证有两位数显示
          id="minutes"
          readOnly={showTimeReadOnly} //默认只读
          onClick={() => {
            setshowTimeReadOnly(false); //点击后可以编辑
          }}
        />
        <span> 秒后跳转至/other</span>
        <input
          onClick={() => {
            clearTimeout(timer);
          }}
          defaultValue="停止"
          type="button"
        />
      </div>

      {/* 标题 */}
      <div className="title">
        <div>Demo</div>
      </div>

      {/* 主体 */}
      <section className="demoApp">
        {/* 输入框 */}
        <header>
          <input
            type="text"
            className="newNodes"
            placeholder="新增节点"
            onKeyUp={(val) => {
              if (val.key === "Enter") {
                // 设置节点的数组内容
                setdemoLiValue([
                  ...demoLiValue,
                  { name: newNodesValue, value: newNodesValue },
                ]);
                setClearValue(""); // 回车后清空
              }
            }}
            value={ClearValue}
            onChange={(e) => {
              setnewNodesValue(e.target.value); // 赋值给节点的state
              setClearValue(e.target.value); // 因为value设置了值，必须在onchange里面动态设置输入框的值
            }}
          />
        </header>

        {/* 列表 */}
        <section>
          {/* 全选和全不选 */}
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={(e) => handleToggleAll(e)}
            style={{ display: demoLiValue.length === 0 ? "none" : "inline" }} // 没有内容则不显示
          />
          <label
            htmlFor="toggle-all"
            style={{ display: demoLiValue.length === 0 ? "none" : "inline" }} // 没有内容则不显示
          ></label>
          <ul
            className="demo-list"
            ref={ulRef}
            onDoubleClick={(ev: any) => handleEventAgent(ev)}
          >
            {handleDemoList()}
          </ul>
        </section>

        {/* 列表底部 */}
        <footer
          className="footer"
          style={{ display: demoLiValue.length === 0 ? "none" : "block" }} // 根据是否有值是否显示底部
        >
          <span className="demo-count">
            <span>{itemsLeft}</span>
            <span> items left</span>
          </span>
          <ul className="filters">
            <li>
              <a
                href="#/"
                className={active === "All" ? "selected" : undefined}
                onClick={() => {
                  setactive("All");
                  // 获取到 ul下的所有li，当选项卡为all的时候，表示全部显示，故不设置隐藏
                  ulRef.current.childNodes.forEach((item: any) => {
                    item.classList.remove("hidden");
                    item.classList.add("visable");
                  });
                }}
              >
                All
              </a>
            </li>
            <span> </span>
            <li>
              <a
                href="#/active"
                className={active === "Active" ? "selected" : undefined}
                onClick={() => {
                  setactive("Active");
                  // 如果li 不包含completed并且没有别hidden
                  ulRef.current.childNodes.forEach((item: any) => {
                    if (item.classList.contains("completed")) {
                      item.classList.remove("visable");
                      item.classList.add("hidden");
                    } else if (
                      !item.classList.contains("completed") &&
                      item.classList.contains("hidden")
                    ) {
                      item.classList.add("visable");
                      item.classList.remove("hidden");
                    }
                  });
                }}
              >
                Active
              </a>
            </li>
            <span> </span>
            <li>
              <a
                href="#/completed"
                className={active === "Completed" ? "selected" : undefined}
                onClick={() => {
                  setactive("Completed");
                  // 当为completed的时候，则直接找到 li里面有completed字段的属性即可，
                  ulRef.current.childNodes.forEach((item: any) => {
                    if (!item.classList.contains("completed")) {
                      item.classList.remove("visable");
                      item.classList.add("hidden");
                    } else {
                      item.classList.add("visable");
                      item.classList.remove("hidden");
                    }
                  });
                }}
              >
                Completed
              </a>
            </li>
            <span> </span>
          </ul>
          <button
            className="clear-completed"
            onClick={() => handleClearCompleted()}
          >
            删除已选择
          </button>
        </footer>
      </section>

      {/* 页脚 */}
      <div className="demoFooter">copyright@zhongwei</div>
    </div>
  );
};

export default Home;
