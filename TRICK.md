# 伎俩

## 能量
* struct
```
struct Bet {
    uint256 orderId;
    uint256 amount;
}
```
better
```
struct Bet {
    uint64 orderId;
    uint64 amount;
}
```
* map
```
mapping(uint8 => uint8) bets;
```
better
```
mapping(uint256 => uint256) bets;
```
---
```
mapping(uint256 => Bet) bets;
```
better
```
mapping(uint256 => uint256) bets;
```
* event
```
event msgx(uint8, uint8);
```
better
```
event msgx(uint256, uint256);
```
